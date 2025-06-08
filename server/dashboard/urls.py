# dashboard/urls.py

from django.urls import path
from .views import admin_dashboard
import logging

logger = logging.getLogger(__name__)
logger.debug("✅ DEBUG: dashboard/urls.py loaded")

urlpatterns = [
    path('', admin_dashboard, name='admin-dashboard'),
]

logger.debug(f"✅ DEBUG: dashboard urlpatterns → {urlpatterns}")
