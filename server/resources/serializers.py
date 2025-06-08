import logging
from rest_framework import serializers
from .models import Resource

logger = logging.getLogger(__name__)


class ResourceSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    signed_url = serializers.SerializerMethodField()
    preview_url = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = [
            "id",
            "title",
            "file",
            "file_url",
            "signed_url",
            "preview_url",
            "category",
            "level",
            "term",           # ✅ Included in model and serializer
            "is_free",
            "price",
            "uploaded_at",
        ]
        read_only_fields = ("uploaded_at",)

    def get_file_url(self, obj):
        """✅ Absolute public file URL for download."""
        request = self.context.get("request")
        if obj.file and request:
            url = request.build_absolute_uri(obj.file.url)
            logger.debug("📂 file_url for '%s': %s", obj.title, url)
            return url
        fallback = obj.file.url if obj.file else None
        logger.debug("📂 fallback file_url for '%s': %s", obj.title, fallback)
        return fallback

    def get_signed_url(self, obj):
        """🔐 Signed URL for temporary secure viewing."""
        try:
            url = obj.get_signed_url()
            logger.debug("🔐 signed_url for '%s': %s", obj.title, url)
            return url
        except Exception as e:
            logger.error("❌ Failed to get signed_url for '%s': %s", obj.title, str(e))
            return None

    def get_preview_url(self, obj):
        """
        🖼️ Placeholder for preview image.
        In production: Replace with logic to generate or fetch thumbnail of PDF first page or file icon.
        """
        fallback_preview = "https://storage.googleapis.com/elimu-online-resources-2025/previews/default_preview.png"
        logger.debug("🖼️ Using preview_url for '%s': %s", obj.title, fallback_preview)
        return fallback_preview
