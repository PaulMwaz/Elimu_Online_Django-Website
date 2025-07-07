import os
import logging
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
from google.oauth2 import service_account
from corsheaders.defaults import default_headers, default_methods

# ✅ Load environment variables
load_dotenv()

# ✅ Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# ✅ Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

logger.info("✅ settings.py loaded successfully")

# ✅ Security settings
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
logger.debug(f"✅ DEBUG Mode: {DEBUG}")
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',') + [
    'elimu-backend-59739536402.europe-west1.run.app',
]
logger.debug(f"✅ Allowed Hosts: {ALLOWED_HOSTS}")

# ✅ Installed apps
INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 3rd-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'storages',

    # Local apps
    'resources',
    'users',
    'payments',
    'dashboard',
]

# ✅ Middleware (CORS FIRST)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # 🔥 MUST be first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

# ✅ URLs and WSGI
ROOT_URLCONF = 'elimu_backend.urls'
WSGI_APPLICATION = 'elimu_backend.wsgi.application'

# ✅ Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ✅ Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
logger.debug("✅ Database config loaded.")

# ✅ Password validation
AUTH_PASSWORD_VALIDATORS = []

# ✅ Localization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Nairobi'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# ✅ Static & media files
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ✅ Google Cloud Storage
GS_BUCKET_NAME = os.getenv("GS_BUCKET_NAME")
gcs_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

if gcs_path and os.path.exists(gcs_path):
    GS_CREDENTIALS = service_account.Credentials.from_service_account_file(gcs_path)
    logger.debug("✅ Google Cloud credentials loaded successfully.")
else:
    GS_CREDENTIALS = None
    logger.warning("❌ Google Cloud credentials file not found.")

DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
MEDIA_URL = f"https://storage.googleapis.com/{GS_BUCKET_NAME}/"

# ✅ Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}
logger.debug("✅ REST Framework loaded.")

# ✅ JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}
logger.debug("✅ JWT settings applied.")

# ✅ CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "https://elimu-online.onrender.com",  # ✅ Frontend domain
]
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.onrender\.com$",  # Support wildcard if needed
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = list(default_headers) + [
    "access-control-allow-origin",
    "access-control-allow-credentials",
]
CORS_ALLOW_METHODS = list(default_methods)

# Optional for debugging: Allow everything (DO NOT USE in production)
# CORS_ALLOW_ALL_ORIGINS = True

logger.debug("✅ CORS configuration complete:")
logger.debug(f"   Origins: {CORS_ALLOWED_ORIGINS}")
logger.debug(f"   Headers: {CORS_ALLOW_HEADERS}")
logger.debug(f"   Methods: {CORS_ALLOW_METHODS}")

# ✅ Jazzmin admin theme
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
logger.debug("✅ Jazzmin settings loaded.")

# ✅ M-Pesa configuration
MPESA_ENV = os.getenv("MPESA_ENV", "sandbox")
MPESA_SHORTCODE = os.getenv("MPESA_SHORTCODE")
MPESA_CONSUMER_KEY = os.getenv("MPESA_CONSUMER_KEY")
MPESA_CONSUMER_SECRET = os.getenv("MPESA_CONSUMER_SECRET")
MPESA_PASSKEY = os.getenv("MPESA_PASSKEY")
MPESA_CALLBACK_URL = os.getenv("MPESA_CALLBACK_URL")

logger.debug("✅ M-Pesa credentials loaded.")
logger.debug(f"   MPESA_ENV: {MPESA_ENV}")
logger.debug(f"   SHORTCODE: {MPESA_SHORTCODE}")
logger.debug(f"   CALLBACK: {MPESA_CALLBACK_URL}")

# ✅ Default Auto Field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
logger.debug("✅ Default auto field set.")

logger.debug("✅ All settings loaded and ready.")
