import os
import logging
from pathlib import Path
from datetime import timedelta
from google.oauth2 import service_account
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Setup base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# ✅ Logging configuration (for debug logs)
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

# ✅ Core security settings
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = ['*']  # Update for production

# ✅ Installed apps
INSTALLED_APPS = [
    'jazzmin',  # 🪄 Jazzmin before Django admin
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 3rd party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'storages',

    # Your apps
    'resources',
    'users',
    'payments',
    'dashboard',
]

# ✅ Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

# ✅ URLs and templates
ROOT_URLCONF = 'elimu_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
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

WSGI_APPLICATION = 'elimu_backend.wsgi.application'

# ✅ PostgreSQL database config
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'elimu_db'),
        'USER': os.getenv('DB_USER', 'elimu_online_db_user'),
        'PASSWORD': os.getenv('DB_PASSWORD', '1234567'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# ✅ Password validation (you can extend in production)
AUTH_PASSWORD_VALIDATORS = []

# ✅ Localization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Nairobi'
USE_I18N = True
USE_TZ = True

# ✅ Static files
STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

# ✅ Google Cloud Storage
GS_BUCKET_NAME = os.getenv("GS_BUCKET_NAME", "elimu-online-resources-254")
GS_CREDENTIALS = service_account.Credentials.from_service_account_file(
    os.path.join(BASE_DIR, "gcs-credentials.json")
)
DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
MEDIA_URL = f"https://storage.googleapis.com/{GS_BUCKET_NAME}/"

# ✅ Django REST Framework + JWT
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

# ✅ CORS setup (allow all during dev)
CORS_ALLOW_ALL_ORIGINS = True

# ✅ Jazzmin admin customization
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

# ✅ Auto primary key type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
