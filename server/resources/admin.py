from django.contrib import admin, messages
from django.utils.html import format_html
from django.conf import settings
from google.cloud import storage

from .models import Resource
from .forms import ResourceAdminForm


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    form = ResourceAdminForm

    # ✅ Columns to show in admin list
    list_display = (
        'title', 'category', 'level', 'is_free', 'price', 'uploaded_at',
        'preview_link', 'download_link'
    )
    list_filter = ('category', 'level', 'is_free')
    search_fields = ('title',)
    ordering = ('-uploaded_at',)

    # ✅ Make fields read-only
    readonly_fields = ('uploaded_at', 'preview_link', 'download_link')

    # ✅ Layout of fields in admin form
    fieldsets = (
        (None, {
            'fields': ('title', 'file', 'category', 'level', 'is_free', 'price', 'preview_link', 'download_link')
        }),
        ('Metadata', {
            'fields': ('uploaded_at',),
            'classes': ('collapse',),
        }),
    )

    # ✅ Preview file (opens in new tab)
    def preview_link(self, obj):
        if obj.file:
            return format_html(f'<a href="{obj.file.url}" target="_blank">🔍 Preview</a>')
        return "No file available"
    preview_link.short_description = "Preview"

    # ✅ Download file directly
    def download_link(self, obj):
        if obj.file:
            return format_html(f'<a href="{obj.file.url}" download>📥 Download</a>')
        return "No file available"
    download_link.short_description = "Download"

    # ✅ On delete, remove file from Google Cloud Storage
    def delete_model(self, request, obj):
        try:
            storage_client = storage.Client(credentials=settings.GS_CREDENTIALS)
            bucket = storage_client.bucket(settings.GS_BUCKET_NAME)
            blob = bucket.blob(obj.file.name)

            if blob.exists():
                blob.delete()
                self.message_user(request, "✅ File deleted from GCS.", level=messages.SUCCESS)
            else:
                self.message_user(request, "⚠️ File not found in GCS.", level=messages.WARNING)

        except Exception as e:
            self.message_user(
                request,
                f"⚠️ GCS file deletion failed: {str(e)}",
                level=messages.ERROR
            )

        # Proceed with deleting from database
        super().delete_model(request, obj)
