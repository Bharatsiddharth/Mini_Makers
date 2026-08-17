"""Test Gmail SMTP credentials."""
import smtplib
import ssl

HOST = "smtp.gmail.com"
PORT = 587
USER = "bharat24me025@satiengg.in"
PASSWORD = "gcij oxzo dyha rkyj"

try:
    server = smtplib.SMTP(HOST, PORT, timeout=15)
    server.ehlo()
    server.starttls(context=ssl.create_default_context())
    server.ehlo()
    server.login(USER, PASSWORD)
    print("SMTP LOGIN OK")
    server.quit()
except Exception as e:
    print(f"SMTP FAILED: {type(e).__name__}: {e}")