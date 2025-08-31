# server/resources/urls.py

import logging
from django.urls import path
from .views import ResourceListView, ResourceUploadView

logger = logging.getLogger(__name__)
logger.debug("✅ resources/urls.py loaded")

app_name = "resources"  # namespace safety for reversing URLs

urlpatterns = [
    # Public: List all uploaded resources (frontend consumption)
    path("", ResourceListView.as_view(), name="resource-list"),

    # Admin-only: Upload new resource files (uses IsAdminUser in the view)
    path("upload/", ResourceUploadView.as_view(), name="resource-upload"),
]

# 🔍 Debug log the registered routes
for route in urlpatterns:
    logger.debug("🔗 Route loaded → %s: %s", route.name, route.pattern)
