"""
Django settings for petal_backend — the Petal & Co. API.

Database is Supabase Postgres by default, but we fall back to SQLite
when the configured Postgres host cannot be reached in local dev.
This allows the app to boot and lets the auth endpoints work without
an external network dependency.
"""

import os
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
)
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("DJANGO_SECRET_KEY", default="dev-only-insecure-secret-change-me")
DEBUG = env("DEBUG")

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["localhost", "127.0.0.1", "0.0.0.0"])

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",
    # local
    "accounts",
    "catalog",
    "orders",
    "analytics",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "petal_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "petal_backend.wsgi.application"

# ---- Database: use Supabase Postgres by default and fail loudly if it is unreachable ----
DEFAULT_SQLITE_DB = f"sqlite:///{BASE_DIR / 'db.sqlite3'}"
USE_SQLITE_FALLBACK = env.bool("USE_SQLITE_FALLBACK", default=False)
DATABASE_URL = env("DATABASE_URL", default=DEFAULT_SQLITE_DB)

if str(DATABASE_URL).startswith(("postgresql://", "postgres://")):
    try:
        import psycopg

        with psycopg.connect(DATABASE_URL, connect_timeout=5, sslmode=env("DB_SSLMODE", default="require")) as conn:
            conn.execute("SELECT 1")
    except Exception as exc:
        if USE_SQLITE_FALLBACK:
            DATABASE_URL = DEFAULT_SQLITE_DB
            os.environ["DATABASE_URL"] = DATABASE_URL
        else:
            raise RuntimeError(
                "Supabase Postgres is unreachable. Fix DATABASE_URL or set USE_SQLITE_FALLBACK=True."
            ) from exc

DATABASES = {"default": env.db("DATABASE_URL", default=DATABASE_URL)}

# Supabase requires SSL for external connections (skip for sqlite/local dev).
if DATABASES["default"]["ENGINE"] == "django.db.backends.postgresql":
    DATABASES["default"]["OPTIONS"] = {
        "sslmode": env("DB_SSLMODE", default="require"),
        # Disable psycopg3's automatic server-side prepared statements.
        # psycopg3 prepares a query on the server once it sees the same query
        # shape run a few times in one session — fine on a direct connection,
        # but Supabase's pooled connection (Supavisor, used e.g. on Render)
        # can route different statements from the same "session" to different
        # backend Postgres connections, so a statement prepared against one
        # physical connection can vanish before the next repeat of that same
        # query runs. This exactly matches loops that repeat the same query
        # shape multiple times in one request — like checkout's per-item
        # OrderItem inserts and Product.stock updates — while one-off single
        # queries (login, product list) keep working fine either way.
        "prepare_threshold": None,
    }

AUTH_USER_MODEL = "accounts.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---- DRF ----
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticatedOrReadOnly",),
    "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend",),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

from datetime import timedelta  # noqa: E402

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=14),
    "ROTATE_REFRESH_TOKENS": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ---- CORS ----
# Point this at wherever the Next.js frontend runs.
# Normalize trailing slashes so values like https://example.vercel.app/ are accepted.
CORS_ALLOWED_ORIGINS = [
    origin.rstrip("/")
    for origin in env.list(
        "CORS_ALLOWED_ORIGINS",
        default=["http://localhost:3000", "http://127.0.0.1:3000"],
    )
    if origin.strip()
]
CORS_ALLOW_CREDENTIALS = True

# Some browsers and frameworks also require CSRF trust for the same origin.
CSRF_TRUSTED_ORIGINS = [
    origin.rstrip("/")
    for origin in env.list("CSRF_TRUSTED_ORIGINS", default=[])
    if origin.strip()
]

# Disable Django's automatic APPEND_SLASH redirect for POST requests
# (frontend sends exact API paths; preventing redirects preserves POST bodies)
APPEND_SLASH = False

# ---- Email ----
# Defaults to printing emails to the console so local dev works even without
# SMTP creds in .env. Set EMAIL_BACKEND to the smtp backend + the rest of
# these vars in .env to actually send mail.
EMAIL_BACKEND = env("EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend")
EMAIL_HOST = env("EMAIL_HOST", default="")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)
EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS", default=True)
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default="")
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="Petal & Co. <noreply@example.com>")
# Some hosts (Render, Heroku, etc.) silently block/drop outbound SMTP
# connections rather than rejecting them — without a timeout, smtplib hangs
# indefinitely, which eventually kills the entire worker process (SIGKILL)
# and surfaces as an opaque 500 with no catchable exception. A short timeout
# turns that hang into a normal, catchable socket.timeout that orders/emails.py
# already handles gracefully.
EMAIL_TIMEOUT = env.int("EMAIL_TIMEOUT", default=10)
# Where "new order" admin notifications go. Falls back to the SMTP login if unset.
SUPPORT_EMAIL = env("SUPPORT_EMAIL", default=EMAIL_HOST_USER)

# Brevo (https://www.brevo.com) HTTPS email API — used instead of raw SMTP in
# orders/emails.py whenever this is set, since most free-tier hosts (Render
# included) block outbound SMTP ports entirely. Leave unset locally to keep
# using the console/SMTP backend above for local dev.
BREVO_API_KEY = env("BREVO_API_KEY", default="")

# ---- Supabase Storage (product image uploads) ----
# SUPABASE_SERVICE_ROLE_KEY is a SECRET — server-side only, never send it to
# the frontend. It's different from NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY above.
SUPABASE_URL = env("SUPABASE_URL", default=env("NEXT_PUBLIC_SUPABASE_URL", default=""))
SUPABASE_SERVICE_ROLE_KEY = env("SUPABASE_SERVICE_ROLE_KEY", default="")
SUPABASE_STORAGE_BUCKET = env("SUPABASE_STORAGE_BUCKET", default="product-images")

# Make sure order-email failures (caught+logged in orders/emails.py, never raised
# so checkout can't break) are always visible in the terminal instead of being
# silently swallowed by whatever the ambient logging config happens to be.
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "loggers": {
        "orders.emails": {"handlers": ["console"], "level": "DEBUG", "propagate": False},
        # With DEBUG=False (production), Django swallows unhandled-exception
        # tracebacks by default instead of printing them anywhere — so every
        # 500 in the Render logs so far has shown up with zero detail. This
        # forces the full traceback for every 500 onto the console, which
        # Render captures in its Logs tab.
        "django.request": {"handlers": ["console"], "level": "ERROR", "propagate": False},
    },
}
