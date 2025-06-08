# server/elimu_backend/asgi.py

import os
import logging
from django.core.asgi import get_asgi_application

# ✅ Configure logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# ✅ Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'elimu_backend.settings')
logger.debug("✅ DJANGO_SETTINGS_MODULE set to 'elimu_backend.settings'")

# ✅ Load ASGI application
try:
    application = get_asgi_application()
    logger.debug("✅ ASGI application loaded successfully.")
except Exception as e:
    logger.exception("❌ Failed to load ASGI application: %s", e)
    raise
