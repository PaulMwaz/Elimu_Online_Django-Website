# server/resources/views.py

import logging
from typing import Any, Dict

from django.db import IntegrityError
from django.db.models import Q
from django.http import HttpRequest
from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from .models import Resource
from .serializers import ResourceSerializer

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


def _has_field(model, field_name: str) -> bool:
    return any(f.name == field_name for f in model._meta.get_fields())


class ResourceListView(generics.ListAPIView):
    """
    Public endpoint to list resources.
    Supports optional filtering via query params:
      - q: search in title
      - category: exact match
      - level: exact match
      - term: exact match
      - free: true|false
    """
    serializer_class = ResourceSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Resource.objects.all().order_by("-created_at")

        request: HttpRequest = self.request
        q = request.query_params.get("q")
        category = request.query_params.get("category")
        level = request.query_params.get("level")
        term = request.query_params.get("term")
        free = request.query_params.get("free")

        logger.debug(
            "🔎 ResourceListView filters → q=%s | category=%s | level=%s | term=%s | free=%s",
            q, category, level, term, free,
        )

        if q:
            qs = qs.filter(Q(title__icontains=q))

        if category:
            qs = qs.filter(category=category)

        if level:
            qs = qs.filter(level=level)

        if term:
            qs = qs.filter(term=term)

        if free is not None:
            free_norm = str(free).strip().lower()
            if free_norm in {"true", "1", "yes"}:
                qs = qs.filter(is_free=True)
            elif free_norm in {"false", "0", "no"}:
                qs = qs.filter(is_free=False)

        logger.debug("📊 ResourceListView queryset count after filters: %s", qs.count())
        return qs

    def get_serializer_context(self) -> Dict[str, Any]:
        return {"request": self.request}

    def list(self, request, *args, **kwargs):
        ip = request.META.get("REMOTE_ADDR")
        logger.debug("📥 ResourceListView from IP: %s", ip)
        response = super().list(request, *args, **kwargs)
        logger.info("✅ Listed %d resources", len(response.data))
        return response


class ResourceUploadView(generics.CreateAPIView):
    """
    Admin-only endpoint to upload a new resource.
    Accepts multipart/form-data:
      - title, file, category, level, term (optional), is_free, price
    """
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_context(self) -> Dict[str, Any]:
        return {"request": self.request}

    def perform_create(self, serializer):
        logger.debug("📤 Starting upload for admin user=%s", self.request.user)

        try:
            # If your model has uploaded_by, attach current user safely.
            save_kwargs = {}
            if _has_field(Resource, "uploaded_by"):
                save_kwargs["uploaded_by"] = self.request.user

            instance: Resource = serializer.save(**save_kwargs)
            logger.info(
                "✅ Resource saved (id=%s) title='%s' category='%s' level='%s' term='%s' free=%s price=%s",
                instance.pk, instance.title, instance.category, instance.level, instance.term,
                instance.is_free, instance.price
            )

            # Sanitize storage filename (remove spaces) for better GCS compatibility
            if instance.file and " " in instance.file.name:
                original_name = instance.file.name
                instance.file.name = original_name.replace(" ", "_")
                instance.save(update_fields=["file"])
                logger.warning("⚠️ Filename sanitized: '%s' → '%s'", original_name, instance.file.name)
            else:
                logger.debug("🆗 Filename clean: %s", getattr(instance.file, "name", None))

        except IntegrityError as e:
            logger.error("❌ IntegrityError while saving resource: %s", e)
            raise
        except Exception as e:
            logger.exception("❌ Unexpected error while saving resource")
            raise

    def create(self, request, *args, **kwargs):
        logger.info("🔐 Upload initiated by admin: %s", request.user)
        response: Response = super().create(request, *args, **kwargs)
        logger.info("📦 Upload complete. New Resource ID: %s", response.data.get("id"))
        return response
