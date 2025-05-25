import logging
from django.contrib import admin, messages
from django.utils.html import format_html
from django.conf import settings
from google.cloud import storage

from .models import Resource
from .forms import ResourceAdminForm

logger = logging.getLogger(__name__)

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    form = ResourceAdminForm

    # ✅ Columns in the list display
    list_display = (
        'title', 'category', 'level', 'term', 'is_free', 'price', 'uploaded_at',
        'preview_link', 'download_link'
    )
    list_filter = ('category', 'level', 'term', 'is_free')
    search_fields = ('title',)
    ordering = ('-uploaded_at',)

    readonly_fields = ('uploaded_at', 'preview_link', 'download_link')

    fieldsets = (
        (None, {
            'fields': (
                'title', 'file', 'category',
                'level', 'term', 'is_free', 'price',
                'preview_link', 'download_link',
            )
        }),
        ('Metadata', {
            'fields': ('uploaded_at',),
            'classes': ('collapse',),
        }),
    )

    def preview_link(self, obj):
        if obj.file:
            url = obj.file.url
            logger.debug("🔍 Preview link generated for %s: %s", obj.title, url)
            return format_html(f'<a href="{url}" target="_blank">🔍 Preview</a>')
        return "No file available"
    preview_link.short_description = "Preview"

    def download_link(self, obj):
        if obj.file:
            url = obj.file.url
            logger.debug("📥 Download link for %s: %s", obj.title, url)
            return format_html(f'<a href="{url}" download>📥 Download</a>')
        return "No file available"
    download_link.short_description = "Download"

    def delete_model(self, request, obj):
        logger.info("🗑️ Admin triggered delete for: %s", obj.title)

        try:
            storage_client = storage.Client(credentials=settings.GS_CREDENTIALS)
            bucket = storage_client.bucket(settings.GS_BUCKET_NAME)
            blob = bucket.blob(obj.file.name)

            if blob.exists():
                blob.delete()
                logger.info("✅ File deleted from GCS: %s", obj.file.name)
                self.message_user(request, "✅ File deleted from GCS.", level=messages.SUCCESS)
            else:
                logger.warning("⚠️ File not found in GCS: %s", obj.file.name)
                self.message_user(request, "⚠️ File not found in GCS.", level=messages.WARNING)

        except Exception as e:
            logger.error("❌ Failed to delete file from GCS: %s", str(e))
            self.message_user(
                request,
                f"❌ Error deleting from GCS: {str(e)}",
                level=messages.ERROR
            )

        super().delete_model(request, obj)
