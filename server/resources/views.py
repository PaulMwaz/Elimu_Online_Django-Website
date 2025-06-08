import logging
from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import Resource
from .serializers import ResourceSerializer

logger = logging.getLogger(__name__)


# ✅ Public API to list all resources (frontend display)
class ResourceListView(generics.ListAPIView):
    queryset = Resource.objects.all().order_by("-uploaded_at")
    serializer_class = ResourceSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {"request": self.request}

    def list(self, request, *args, **kwargs):
        logger.debug("📥 ResourceListView called from IP: %s", request.META.get('REMOTE_ADDR'))
        response = super().list(request, *args, **kwargs)
        logger.info("✅ Listed %d resources", len(response.data))
        return response


# ✅ Admin-only endpoint to upload new files
class ResourceUploadView(generics.CreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        logger.debug("📤 Starting upload process for admin: %s", self.request.user)
        instance = serializer.save()
        logger.info("✅ Resource saved: '%s' in category '%s'", instance.title, instance.category)

        # ✅ Sanitize file name for GCS compatibility (no spaces)
        if instance.file and " " in instance.file.name:
            original_name = instance.file.name
            instance.file.name = original_name.replace(" ", "_")
            instance.save()
            logger.warning("⚠️ Filename sanitized: '%s' → '%s'", original_name, instance.file.name)
        else:
            logger.debug("🆗 Filename clean: %s", instance.file.name)

    def create(self, request, *args, **kwargs):
        logger.info("🔐 Upload initiated by: %s", request.user)
        response = super().create(request, *args, **kwargs)
        logger.info("📦 Upload complete. Resource ID: %s", response.data.get("id"))
        return response
