# server/elimu_backend/settings.py

import os
import logging
from pathlib import Path
from datetime import timedelta

from dotenv import load_dotenv
from google.oauth2 import service_account
from corsheaders.defaults import default_headers
import dj_database_url

# ===============================
# Environment & Base Paths
# ===============================
load_dotenv()
BASE_DIR = Path(__file__).resolve().parent.parent

# ===============================
# Logging (verbose everywhere)
# ===============================
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "DEBUG"},
}
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.info("✅ settings.py loaded")

# ===============================
# Core Settings
# ===============================
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
DEBUG = os.getenv("DEBUG", "True") == "True"
logger.debug(f"DEBUG={DEBUG}")

PUBLIC_APP_DOMAIN = os.getenv("PUBLIC_APP_DOMAIN", "elimu-online.onrender.com")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", f"https://{PUBLIC_APP_DOMAIN}")

ALLOWED_HOSTS = list(
    set(
        [
            "localhost",
            "127.0.0.1",
            ".onrender.com",
            PUBLIC_APP_DOMAIN,
        ]
    )
)
logger.debug(f"ALLOWED_HOSTS={ALLOWED_HOSTS}")

# ===============================
# Installed Apps / Auth
# ===============================
INSTALLED_APPS = [
    "jazzmin",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "storages",
    "resources",
    "users",
    "payments",
    "dashboard",
]

AUTH_USER_MODEL = "users.CustomUser"
logger.debug("AUTH_USER_MODEL=users.CustomUser")

# ===============================
# Middleware (CorsMiddleware FIRST)
# ===============================
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # must be first
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

ROOT_URLCONF = "elimu_backend.urls"
WSGI_APPLICATION = "elimu_backend.wsgi.application"

# ===============================
# Templates
# ===============================
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ===============================
# Database (Smart switch)
# ===============================
# Priority:
# 1) DATABASE_URL -> Postgres via dj_database_url  (Render/Prod)
# 2) DB_ENGINE=postgres -> Local Postgres using LOCAL_DB_* envs
# 3) default -> SQLite (great for local dev)
db_url = os.getenv("DATABASE_URL")
db_engine = os.getenv("DB_ENGINE", "").lower()

if db_url:
    logger.debug("DB: Using DATABASE_URL (managed Postgres)")
    DATABASES = {
        "default": dj_database_url.parse(db_url, conn_max_age=600, ssl_require=not DEBUG)
    }
elif db_engine == "postgres":
    logger.debug("DB: Using Local Postgres via LOCAL_DB_* env vars")
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("LOCAL_DB_NAME", "elimu_db"),
            "USER": os.getenv("LOCAL_DB_USER", "elimu_user"),
            "PASSWORD": os.getenv("LOCAL_DB_PASSWORD", "1234567"),
            "HOST": os.getenv("LOCAL_DB_HOST", "localhost"),
            "PORT": os.getenv("LOCAL_DB_PORT", "5432"),
        }
    }
else:
    logger.debug("DB: Using SQLite (local development default)")
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

logger.debug(f"DATABASES['default']={DATABASES['default']}")

# ===============================
# i18n / tz
# ===============================
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Nairobi"
USE_I18N = True
USE_L10N = True
USE_TZ = True

# ===============================
# Static / Media
# ===============================
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ===============================
# Google Cloud Storage (optional)
# ===============================
GS_BUCKET_NAME = os.getenv("GS_BUCKET_NAME")
gcs_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

if gcs_path and os.path.exists(gcs_path):
    GS_CREDENTIALS = service_account.Credentials.from_service_account_file(gcs_path)
    logger.debug("Google Cloud credentials loaded from file path")
elif os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON"):
    from google.oauth2.service_account import Credentials
    import json

    try:
        creds_json = json.loads(os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON"))
        GS_CREDENTIALS = Credentials.from_service_account_info(creds_json)
        logger.debug("Google Cloud credentials loaded from JSON env")
    except Exception as e:
        GS_CREDENTIALS = None
        logger.warning(f"Failed to load GCS creds from JSON env: {e}")
else:
    GS_CREDENTIALS = None
    logger.warning("Google Cloud credentials not found")

DEFAULT_FILE_STORAGE = (
    "storages.backends.gcloud.GoogleCloudStorage"
    if GS_BUCKET_NAME
    else "django.core.files.storage.FileSystemStorage"
)
GCS_MEDIA_URL = f"https://storage.googleapis.com/{GS_BUCKET_NAME}/" if GS_BUCKET_NAME else None

# ===============================
# DRF / JWT
# ===============================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
}
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
}
logger.debug("REST_FRAMEWORK + SIMPLE_JWT configured")

# ===============================
# Proxy Awareness (Render/Nginx)
# ===============================
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
APPEND_SLASH = True

# ===============================
# CORS / CSRF
# ===============================
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = False

CORS_ALLOWED_ORIGINS = [
    FRONTEND_ORIGIN,              # e.g. https://elimu-online.onrender.com
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.onrender\.com$",
]
CORS_ALLOW_HEADERS = list(default_headers) + ["Authorization", "Content-Type"]
CORS_EXPOSE_HEADERS = ["Authorization", "Content-Type"]
CORS_ALLOW_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]

CSRF_TRUSTED_ORIGINS = [
    f"https://{PUBLIC_APP_DOMAIN}",
]
logger.debug(
    "CORS configured | "
    f"FRONTEND_ORIGIN={FRONTEND_ORIGIN} | "
    f"CORS_ALLOW_CREDENTIALS={CORS_ALLOW_CREDENTIALS} | "
    f"CSRF_TRUSTED_ORIGINS={CSRF_TRUSTED_ORIGINS}"
)

# ===============================
# Jazzmin (admin UI)
# ===============================
JAZZMIN_SETTINGS = {
    "site_title": "Elimu-Online Admin",
    "site_header": "Elimu-Online Dashboard",
    "site_brand": "Elimu-Online",
    "welcome_sign": "Welcome to the Admin Portal",
    "copyright": "© 2025 Elimu",
    "show_sidebar": True,
    "navigation_expanded": True,
    "icons": {
        "auth": "fas fa-users",
        "resources.Resource": "fas fa-book",
        "users.Profile": "fas fa-id-badge",
    },
    "order_with_respect_to": ["auth", "resources", "users"],
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
}
logger.debug("Jazzmin configured")

# ===============================
# M-Pesa (env-provided)
# ===============================
MPESA_ENV = os.getenv("MPESA_ENV", "sandbox")
MPESA_SHORTCODE = os.getenv("MPESA_SHORTCODE")
MPESA_CONSUMER_KEY = os.getenv("MPESA_CONSUMER_KEY")
MPESA_CONSUMER_SECRET = os.getenv("MPESA_CONSUMER_SECRET")
MPESA_PASSKEY = os.getenv("MPESA_PASSKEY")
MPESA_CALLBACK_URL = os.getenv("MPESA_CALLBACK_URL")
logger.debug("M-Pesa env loaded")

# ===============================
# Defaults
# ===============================
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
logger.info("✅ settings.py configured successfully")
