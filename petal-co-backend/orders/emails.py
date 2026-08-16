"""
Order-related transactional emails.

Two emails go out per checkout:
  - send_order_confirmation_email(order): "we received your order" -> customer
  - send_admin_new_order_notification(order): full order details -> SUPPORT_EMAIL

Both are best-effort: a failure here is logged, never raised, so a flaky SMTP
connection can't break checkout for the customer. Call these via
transaction.on_commit(...) from the view so they only fire after the order
row (and stock decrement) has actually been committed to the DB.
"""

import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


def _send(subject, to_email, text_body, html_body=None):
    if not to_email:
        logger.warning("Skipped email %r — no recipient address.", subject)
        return
    try:
        message = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[to_email],
        )
        if html_body:
            message.attach_alternative(html_body, "text/html")
        message.send(fail_silently=False)
    except Exception:
        logger.exception("Failed to send email %r to %s", subject, to_email)


def _order_items_text(order):
    lines = []
    for item in order.items.all():
        line_total = item.quantity * item.price_at_purchase
        lines.append(f"  - {item.product_name}  x{item.quantity}  \u20b9{line_total}")
    return "\n".join(lines)


def send_order_confirmation_email(order):
    """Customer-facing: 'we received your order request'."""
    subject = f"We've received your order {order.order_number} \u2014 Petal & Co."

    text_body = (
        f"Hi {order.shipping_name or 'there'},\n\n"
        f"Thanks for shopping with Petal & Co! We've received your order request "
        f"and it's now being processed.\n\n"
        f"Order: {order.order_number}\n"
        f"Items:\n{_order_items_text(order)}\n\n"
        f"Total: \u20b9{order.total}\n"
        f"Payment method: {order.payment_method}\n\n"
        f"Shipping to:\n"
        f"{order.shipping_address}\n"
        f"{order.city}, {order.state} {order.postal_code}\n\n"
        f"We'll email you again once it ships. Questions? Just reply to this email "
        f"or reach us at {settings.SUPPORT_EMAIL}.\n\n"
        f"\u2014 Petal & Co."
    )

    html_body = render_to_string(
        "emails/order_confirmation.html",
        {"order": order, "items": order.items.all(), "support_email": settings.SUPPORT_EMAIL},
    )

    _send(subject, order.email, text_body, html_body)


def send_admin_new_order_notification(order):
    """Internal: full order + customer details, sent to SUPPORT_EMAIL."""
    subject = f"New order {order.order_number} \u2014 \u20b9{order.total}"

    text_body = (
        f"New order placed on Petal & Co.\n\n"
        f"Order: {order.order_number}\n"
        f"Customer: {order.shipping_name} ({order.email})\n"
        f"Phone: {order.phone}\n"
        f"Payment method: {order.payment_method}\n\n"
        f"Items:\n{_order_items_text(order)}\n\n"
        f"Total: \u20b9{order.total}\n\n"
        f"Shipping address:\n"
        f"{order.shipping_address}\n"
        f"{order.city}, {order.state} {order.postal_code}\n\n"
        f"Referral source: {order.referral_source}\n"
        f"Notes: {order.notes or '-'}\n"
    )

    _send(subject, settings.SUPPORT_EMAIL, text_body)
