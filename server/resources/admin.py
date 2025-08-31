import logging
from django.contrib import admin, messages
from django.utils.html import format_html

from .models import Resource
try:
    from .forms import ResourceAdminForm  # optional
except Exception:
    ResourceAdminForm = None

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    form = ResourceAdminForm if ResourceAdminForm else None

    list_display = (
        "id", "title", "category", "level", "term", "is_free",
        "price", "created_at", "preview_link", "download_link",
    )
    list_filter = ("category", "level", "term", "is_free", "created_at")
    search_fields = ("title",)
    ordering = ("-created_at",)

    readonly_fields = ("created_at", "preview_link", "download_link")

    fieldsets = (
        (None, {
            "fields": (
                "title", "file", "category",
                "level", "term", "is_free", "price",
                "preview_link", "download_link",
            )
        }),
        ("Metadata", {
            "fields": ("created_at",),
            "classes": ("collapse",),
        }),
    )

    def preview_link(self, obj: Resource):
        if obj.file:
            url = obj.file.url
            logger.debug("🔍 Generated preview link for %s → %s", obj.title, url)
            return format_html('<a href="{}" target="_blank">🔍 Preview</a>', url)
        return "No file available"
    preview_link.short_description = "Preview"

    def download_link(self, obj: Resource):
        if obj.file:
            url = obj.file.url
            logger.debug("📥 Generated download link for %s → %s", obj.title, url)
            return format_html('<a href="{}" download>📥 Download</a>', url)
        return "No file available"
    download_link.short_description = "Download"

    def save_model(self, request, obj: Resource, form, change):
        creating = not change
        super().save_model(request, obj, form, change)
        if creating:
            logger.info("✅ Created Resource id=%s title=%s", obj.pk, obj.title)
        else:
            logger.info("✏️ Updated Resource id=%s title=%s", obj.pk, obj.title)

    def delete_model(self, request, obj: Resource):
        fname = obj.file.name if obj.file else None
        logger.info("🗑️ Deleting Resource id=%s title=%s file=%s", obj.pk, obj.title, fname)
        try:
            if fname and obj.file.storage.exists(fname):
                obj.file.storage.delete(fname)
                logger.info("✅ Deleted file from storage: %s", fname)
                self.message_user(request, f"✅ Deleted file from storage: {fname}", level=messages.SUCCESS)
            else:
                logger.warning("⚠️ File not found in storage: %s", fname)
                self.message_user(request, "⚠️ File not found in storage.", level=messages.WARNING)
        except Exception as e:
            logger.exception("❌ Error deleting file from storage: %s", e)
            self.message_user(request, f"❌ Error deleting from storage: {e}", level=messages.ERROR)
        super().delete_model(request, obj)
