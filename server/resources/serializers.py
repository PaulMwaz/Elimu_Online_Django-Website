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
            "file",          # remove if you don’t want the raw storage path exposed
            "file_url",
            "signed_url",
            "preview_url",
            "category",
            "level",
            "term",
            "is_free",
            "price",
            "created_at",    # ← renamed from uploaded_at
        ]
        read_only_fields = ("created_at",)

    def get_file_url(self, obj):
        if not obj.file:
            return None
        try:
            request = self.context.get("request")
            if request:
                url = request.build_absolute_uri(obj.file.url)
                logger.debug("📂 file_url for '%s': %s", obj.title, url)
                return url
            fallback = obj.file.url
            logger.debug("📂 fallback file_url for '%s': %s", obj.title, fallback)
            return fallback
        except Exception as e:
            logger.error("❌ Error building file_url for '%s': %s", obj.title, e)
            return None

    def get_signed_url(self, obj):
        if not obj.file or obj.is_free:
            return None
        try:
            url = obj.get_signed_url()
            logger.debug("🔐 signed_url for '%s': %s", obj.title, url)
            return url
        except Exception as e:
            logger.error("❌ Failed to get signed_url for '%s': %s", obj.title, e)
            return None

    def get_preview_url(self, obj):
        fallback_preview = "https://storage.googleapis.com/elimu-online-resources-2025/previews/default_preview.png"
        logger.debug("🖼️ Using preview_url for '%s': %s", obj.title, fallback_preview)
        return fallback_preview
