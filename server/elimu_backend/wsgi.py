# wsgi.py
import os
import sys
import logging
from django.core.wsgi import get_wsgi_application

# ✅ Set environment variable for settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'elimu_backend.settings')

# ✅ Setup logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

try:
    logger.debug("🚀 Initializing WSGI application for Elimu-Online...")
    application = get_wsgi_application()
    logger.debug("✅ WSGI application loaded successfully.")
except Exception as e:
    logger.exception("❌ Error while initializing WSGI application:")
    raise e
