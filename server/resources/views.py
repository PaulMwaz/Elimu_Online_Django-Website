import logging
from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.db import IntegrityError
from .models import Resource
from .serializers import ResourceSerializer

logger = logging.getLogger(__name__)

class ResourceListView(generics.ListAPIView):
    queryset = Resource.objects.all().order_by("-created_at")
    serializer_class = ResourceSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {"request": self.request}

    def list(self, request, *args, **kwargs):
        ip = request.META.get("REMOTE_ADDR")
        logger.debug("📥 ResourceListView from IP: %s", ip)
        response = super().list(request, *args, **kwargs)
        logger.info("✅ Listed %d resources", len(response.data))
        return response


class ResourceUploadView(generics.CreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        logger.debug("📤 Starting upload for admin: %s", self.request.user)
        try:
            instance = serializer.save()
            logger.info("✅ Resource saved: '%s' (category: %s)", instance.title, instance.category)
            if instance.file and " " in instance.file.name:
                original_name = instance.file.name
                instance.file.name = original_name.replace(" ", "_")
                instance.save()
                logger.warning("⚠️ Filename sanitized: '%s' → '%s'", original_name, instance.file.name)
            else:
                logger.debug("🆗 Filename clean: %s", getattr(instance.file, "name", None))
        except IntegrityError as e:
            logger.error("❌ Integrity error saving resource: %s", e)
            raise
        except Exception as e:
            logger.exception("❌ Unexpected error saving resource: %s", e)
            raise

    def create(self, request, *args, **kwargs):
        logger.info("🔐 Upload initiated by: %s", request.user)
        response = super().create(request, *args, **kwargs)
        logger.info("📦 Upload complete. Resource ID: %s", response.data.get("id"))
        return response
