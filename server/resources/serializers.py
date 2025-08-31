# server/resources/serializers.py

import logging
from urllib.parse import quote
from rest_framework import serializers

from .models import Resource

logger = logging.getLogger(__name__)


class ResourceSerializer(serializers.ModelSerializer):
    """
    Serializer used by the frontend to display/download resources.

    It exposes:
      - file_url: absolute URL if the object is publicly readable (or local dev).
      - signed_url: short-lived URL for private GCS buckets (uses model.get_signed_url()).
      - preview_url: best link to open/preview the file (prefers signed_url, then file_url).
    """
    file_url = serializers.SerializerMethodField()
    signed_url = serializers.SerializerMethodField()
    preview_url = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = [
            "id",
            "title",
            # "file",          # ← uncomment ONLY if you want to expose the raw storage path
            "file_url",
            "signed_url",
            "preview_url",
            "category",
            "level",
            "term",
            "is_free",
            "price",
            "created_at",      # correct field name (replaces uploaded_at)
        ]
        read_only_fields = ("created_at",)

    # ---------- helpers ----------

    def _absolute(self, url: str) -> str:
        """Return an absolute URL using request context when available."""
        try:
            request = self.context.get("request")
            return request.build_absolute_uri(url) if request else url
        except Exception as e:
            logger.debug("absolute URL fallback (%s): %s", url, e)
            return url

    # ---------- fields ----------

    def get_file_url(self, obj) -> str | None:
        """Public/absolute URL for the stored file if accessible without signing."""
        if not obj.file:
            return None
        try:
            return self._absolute(obj.file.url)
        except Exception as e:
            logger.warning("file_url error for %s: %s", getattr(obj, "title", obj.pk), e)
            return None

    def get_signed_url(self, obj) -> str | None:
        """
        Short-lived signed URL for private buckets.
        Works for free and paid resources alike.
        """
        if not obj.file:
            return None

        get_signed = getattr(obj, "get_signed_url", None)
        if not callable(get_signed):
            logger.debug("get_signed_url() not implemented on Resource model.")
            return None

        try:
            url = get_signed()
            if url:
                logger.debug("signed_url generated for '%s'", getattr(obj, "title", obj.pk))
            return url
        except Exception as e:
            logger.debug("signed_url unavailable for %s: %s", getattr(obj, "title", obj.pk), e)
            return None

    def get_preview_url(self, obj) -> str | None:
        """
        Best preview link for the UI:
          1) use signed_url if available (private bucket),
          2) else use public file_url.
        If you want to force Google Docs Viewer for PDFs, uncomment the block below.
        """
        url = self.get_signed_url(obj) or self.get_file_url(obj)
        if not url:
            return None

        # ---- Optional Google Docs viewer wrapper for PDFs ----
        # try:
        #     if (obj.file and str(obj.file.name).lower().endswith(".pdf")):
        #         return f"https://docs.google.com/viewer?embedded=true&url={quote(url, safe='')}"
        # except Exception:
        #     pass

        return url
