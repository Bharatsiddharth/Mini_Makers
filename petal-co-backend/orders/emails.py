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

import requests
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)

BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email"


def _send(subject, to_email, text_body, html_body=None):
    if not to_email:
        logger.warning("Skipped email %r — no recipient address.", subject)
        return

    if settings.BREVO_API_KEY:
        _send_via_brevo(subject, to_email, text_body, html_body)
        return

    # Local/dev fallback: whatever EMAIL_BACKEND is configured (console
    # backend by default, which just prints the email to the terminal).
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


def _send_via_brevo(subject, to_email, text_body, html_body=None):
    """
    Sends over Brevo's HTTPS REST API instead of raw SMTP. This exists because
    most free-tier PaaS hosts (Render included) block outbound SMTP ports
    (25, 465, 587) entirely, so raw smtplib connections either get silently
    dropped (hanging until they time out) or refused outright. HTTPS (443) is
    never blocked, so an HTTP-based transactional email API is the reliable
    way to actually deliver mail from a host like Render.
    """
    sender_email = settings.EMAIL_HOST_USER or settings.DEFAULT_FROM_EMAIL
    payload = {
        "sender": {"name": "Petal & Co.", "email": sender_email},
        "to": [{"email": to_email}],
        "subject": subject,
        "textContent": text_body,
    }
    if html_body:
        payload["htmlContent"] = html_body

    try:
        response = requests.post(
            BREVO_SEND_URL,
            headers={"api-key": settings.BREVO_API_KEY, "Content-Type": "application/json"},
            json=payload,
            timeout=10,
        )
        if response.status_code >= 300:
            logger.error(
                "Brevo API error sending %r to %s: %s %s",
                subject, to_email, response.status_code, response.text,
            )
    except requests.RequestException:
        logger.exception("Failed to reach Brevo API sending %r to %s", subject, to_email)


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

    try:
        html_body = render_to_string(
            "emails/order_confirmation.html",
            {"order": order, "items": order.items.all(), "support_email": settings.SUPPORT_EMAIL},
        )
    except Exception:
        logger.exception("Failed to render order-confirmation template — falling back to plain text only")
        html_body = None

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
