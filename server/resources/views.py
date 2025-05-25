from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import Resource
from .serializers import ResourceSerializer
import logging

logger = logging.getLogger(__name__)


# ✅ Public view for listing all uploaded resources
class ResourceListView(generics.ListAPIView):
    queryset = Resource.objects.all().order_by("-uploaded_at")
    serializer_class = ResourceSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {"request": self.request}

    def list(self, request, *args, **kwargs):
        logger.debug("📥 API Request: List all resources from %s", request.META.get('REMOTE_ADDR'))
        response = super().list(request, *args, **kwargs)
        logger.debug("✅ Returning %d resources", len(response.data))
        return response


# ✅ Admin-only view to upload new files
class ResourceUploadView(generics.CreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        logger.debug("📤 Starting file upload...")

        instance = serializer.save()
        logger.debug("✅ Resource saved to DB: '%s'", instance.title)

        # Sanitize filename for Google Cloud compatibility
        if instance.file and " " in instance.file.name:
            original = instance.file.name
            instance.file.name = original.replace(" ", "_")
            instance.save()
            logger.info("⚠️ Renamed file from '%s' to '%s'", original, instance.file.name)
        else:
            logger.debug("🆗 Filename is clean: %s", instance.file.name)

    def create(self, request, *args, **kwargs):
        logger.debug("🔐 Upload requested by admin: %s", request.user)
        return super().create(request, *args, **kwargs)
