import logging
from django.urls import path
from .views import ResourceListView, ResourceUploadView

logger = logging.getLogger(__name__)
logger.info("✅ DEBUG: resources/urls.py loaded")

urlpatterns = [
    # ✅ Public: List all uploaded resources (e.g., for frontend display)
    path('', ResourceListView.as_view(), name='resource-list'),

    # ✅ Admin-only: Upload new resource files
    path('upload/', ResourceUploadView.as_view(), name='resource-upload'),
]

# 🔍 Log the registered routes
for route in urlpatterns:
    logger.info(f"🔗 Route loaded → {route.name}: {route.pattern}")
