import os
import logging
from pathlib import Path
from datetime import timedelta
from google.oauth2 import service_account
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# ✅ Logging Configuration
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
logger.info("✅ settings.py loaded successfully")

# ✅ Security Settings
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# ✅ Installed Apps
INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'storages',

    # Project apps
    'resources',
    'users',
    'payments',
    'dashboard',
]

# ✅ Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # must be first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

# ✅ URL Config
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

# ✅ Database (PostgreSQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'elimu_db'),
        'USER': os.getenv('DB_USER', 'elimu_user'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# ✅ Authentication
AUTH_PASSWORD_VALIDATORS = []

# ✅ Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Nairobi'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# ✅ Static and Media Files
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
    logger.debug("✅ GCS credentials loaded from file.")
else:
    GS_CREDENTIALS = None
    logger.warning("❌ GCS credentials file not found or path missing!")

DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
MEDIA_URL = f"https://storage.googleapis.com/{GS_BUCKET_NAME}/"

# ✅ REST Framework & JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ✅ CORS Settings
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "https://elimu-online.onrender.com",  # ✅ your frontend origin
]

logger.debug("✅ CORS configuration loaded")

# ✅ Jazzmin Admin Theme
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

# ✅ M-Pesa Configuration
MPESA_ENV = os.getenv("MPESA_ENV", "sandbox")
MPESA_SHORTCODE = os.getenv("MPESA_SHORTCODE")
MPESA_CONSUMER_KEY = os.getenv("MPESA_CONSUMER_KEY")
MPESA_CONSUMER_SECRET = os.getenv("MPESA_CONSUMER_SECRET")
MPESA_PASSKEY = os.getenv("MPESA_PASSKEY")
MPESA_CALLBACK_URL = os.getenv("MPESA_CALLBACK_URL")

# ✅ Auto Field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ✅ Final log
logger.debug("✅ settings.py completed. All configs loaded.")
