# server/resources/admin.py

import logging
import os
from datetime import datetime
from urllib.parse import quote

from django.contrib import admin, messages
from django.core.files.base import ContentFile
from django.shortcuts import redirect
from django.urls import path, reverse
from django.utils.html import format_html
from django.utils.text import slugify

from .models import Resource

try:
    # Optional custom form – if you don't have one, it's OK.
    from .forms import ResourceAdminForm
except Exception:  # pragma: no cover
    ResourceAdminForm = None

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


def _best_url(obj: Resource) -> str | None:
    """
    Pick the best URL to open/preview the file:
    - use model.get_signed_url() if available (private GCS),
    - else fall back to obj.file.url (public or local).
    """
    if not obj or not obj.file:
        return None

    # Try signed URL first (works with private GCS buckets)
    get_signed = getattr(obj, "get_signed_url", None)
    if callable(get_signed):
        try:
            signed = get_signed()
            if signed:
                logger.debug("🔐 Using signed URL for preview: %s", signed)
                return signed
        except Exception as e:
            logger.debug("Signed URL unavailable for '%s': %s", obj.title, e)

    # Fallback to the storage URL
    try:
        url = obj.file.url
        logger.debug("🌐 Using storage URL for preview: %s", url)
        return url
    except Exception as e:
        logger.warning("No storage URL for '%s': %s", obj.title, e)
        return None


def _suggest_new_name(obj: Resource) -> str:
    """
    Suggest a clean file name based on the resource title and original extension.
    """
    base = slugify(obj.title) or f"resource-{obj.pk}"
    ext = os.path.splitext(obj.file.name or "")[1] or ""
    suggested = f"resources/{base}{ext}"
    logger.debug("📝 Suggested new name for '%s' is '%s'", obj.title, suggested)
    return suggested


def _safe_unique_name(storage, name: str) -> str:
    """
    Ensure the new file name does not collide with an existing blob/key.
    """
    if not storage.exists(name):
        return name

    root, ext = os.path.splitext(name)
    ts = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    unique = f"{root}-{ts}{ext}"
    logger.debug("♻️ Name exists; using unique name '%s'", unique)
    return unique


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    """
    Professional admin for Resources with quick actions:
      • Preview – opens the file/signed URL in a new tab
      • Download – downloads the file
      • Rename – renames the stored object (works for local + GCS)
      • Delete file – removes the stored object only (keeps db record)
    Deleting the model entry removes the file as well (see delete_model()).
    """

    form = ResourceAdminForm if ResourceAdminForm else None

    list_display = (
        "id",
        "title",
        "category",
        "level",
        "term",
        "is_free",
        "price",
        "created_at",
        "preview_link",
        "download_link",
        "rename_btn",
        "delete_file_btn",
    )
    list_filter = ("category", "level", "term", "is_free", "created_at")
    search_fields = ("title",)
    ordering = ("-created_at",)

    readonly_fields = ("created_at", "preview_link", "download_link", "rename_btn", "delete_file_btn")

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "title",
                    "file",
                    "category",
                    "level",
                    "term",
                    "is_free",
                    "price",
                    "preview_link",
                    "download_link",
                    "rename_btn",
                    "delete_file_btn",
                )
            },
        ),
        (
            "Metadata",
            {
                "fields": ("created_at",),
                "classes": ("collapse",),
            },
        ),
    )

    # -------------------------
    # List/change form buttons
    # -------------------------

    def preview_link(self, obj: Resource):
        url = _best_url(obj)
        if url:
            # If you prefer Google Docs viewer for PDFs, you can wrap the URL:
            # if str(url).lower().endswith(".pdf"):
            #     url = f"https://docs.google.com/viewer?embedded=true&url={quote(url, safe='')}"
            logger.debug("🔍 Generated preview link for %s → %s", obj.title, url)
            return format_html('<a class="button" href="{}" target="_blank">🔍 Preview</a>', url)
        return "No file available"

    preview_link.short_description = "Preview"

    def download_link(self, obj: Resource):
        url = _best_url(obj)
        if url:
            logger.debug("📥 Generated download link for %s → %s", obj.title, url)
            return format_html('<a class="button" href="{}" download>📥 Download</a>', url)
        return "No file available"

    download_link.short_description = "Download"

    def rename_btn(self, obj: Resource):
        if not obj.file:
            return "No file"
        url = reverse("admin:resources_resource_rename_file", args=[obj.pk])
        logger.debug("✏️ Rename button URL for id=%s: %s", obj.pk, url)
        return format_html('<a class="button" href="{}">✏️ Rename</a>', url)

    rename_btn.short_description = "Rename file"

    def delete_file_btn(self, obj: Resource):
        if not obj.file:
            return "No file"
        url = reverse("admin:resources_resource_delete_file", args=[obj.pk])
        logger.debug("🗑️ Delete-file button URL for id=%s: %s", obj.pk, url)
        return format_html('<a class="button" href="{}">🗑️ Delete file</a>', url)

    delete_file_btn.short_description = "Delete file"

    # -------------------------
    # Save/delete hooks
    # -------------------------

    def save_model(self, request, obj: Resource, form, change):
        logger.debug("💾 save_model(create=%s) for Resource(title=%s)", not change, obj.title)
        super().save_model(request, obj, form, change)

        # Optional sanitization: replace spaces in stored name
        try:
            if obj.file and " " in obj.file.name:
                old_name = obj.file.name
                new_name = old_name.replace(" ", "_")
                if new_name != old_name:
                    logger.info("⚠️ Sanitizing filename: '%s' → '%s'", old_name, new_name)
                    self._rename_storage_object(obj, new_name)
                    self.message_user(request, f"Filename sanitized to '{new_name}'.", level=messages.WARNING)
        except Exception as e:
            logger.debug("Filename sanitization skipped: %s", e)

        if change:
            logger.info("✏️ Updated Resource id=%s title=%s", obj.pk, obj.title)
        else:
            logger.info("✅ Created Resource id=%s title=%s", obj.pk, obj.title)

    def delete_model(self, request, obj: Resource):
        """
        Deleting the model also deletes the file from storage (generic logic).
        """
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

    # -------------------------
    # Extra admin URLs/actions
    # -------------------------

    def get_urls(self):
        """
        Add two custom admin endpoints:
          /<pk>/rename-file/   – renames the stored file to a clean name (or ?to=<name>)
          /<pk>/delete-file/   – deletes only the stored file; keeps DB row
        """
        urls = super().get_urls()
        my_urls = [
            path(
                "<int:pk>/rename-file/",
                self.admin_site.admin_view(self.rename_file_view),
                name="resources_resource_rename_file",
            ),
            path(
                "<int:pk>/delete-file/",
                self.admin_site.admin_view(self.delete_file_view),
                name="resources_resource_delete_file",
            ),
        ]
        # Place our URLs BEFORE the default ones so they take precedence
        return my_urls + urls

    def rename_file_view(self, request, pk: int):
        """
        Perform a safe rename of the stored object.
        If you pass ?to=<new_name> we use that; otherwise we generate from title.
        """
        obj = self.get_object(request, pk)
        if not obj:
            self.message_user(request, "Resource not found.", level=messages.ERROR)
            return redirect("admin:resources_resource_changelist")

        if not obj.file:
            self.message_user(request, "This resource has no file to rename.", level=messages.WARNING)
            return redirect("admin:resources_resource_change", object_id=obj.pk)

        try:
            current = obj.file.name
            requested = request.GET.get("to") or _suggest_new_name(obj)
            # Ensure path stays under 'resources/' to keep things organized
            if not requested.startswith("resources/"):
                requested = f"resources/{requested.lstrip('/')}"
            new_name = _safe_unique_name(obj.file.storage, requested)

            logger.info("✏️ Renaming storage object: %s → %s", current, new_name)
            self._rename_storage_object(obj, new_name)

            self.message_user(request, f"✅ File renamed to ‘{new_name}’.", level=messages.SUCCESS)
        except Exception as e:
            logger.exception("❌ Rename failed for id=%s", obj.pk)
            self.message_user(request, f"❌ Rename failed: {e}", level=messages.ERROR)

        return redirect("admin:resources_resource_change", object_id=obj.pk)

    def delete_file_view(self, request, pk: int):
        """
        Delete the stored file but keep the Resource row.
        """
        obj = self.get_object(request, pk)
        if not obj:
            self.message_user(request, "Resource not found.", level=messages.ERROR)
            return redirect("admin:resources_resource_changelist")

        if not obj.file:
            self.message_user(request, "No file to delete.", level=messages.WARNING)
            return redirect("admin:resources_resource_change", object_id=obj.pk)

        try:
            name = obj.file.name
            if obj.file.storage.exists(name):
                obj.file.storage.delete(name)
                logger.info("🗑️ Deleted stored object: %s", name)
            obj.file = None
            obj.save(update_fields=["file"])
            self.message_user(request, "✅ File deleted.", level=messages.SUCCESS)
        except Exception as e:
            logger.exception("❌ Deleting stored object failed for id=%s", obj.pk)
            self.message_user(request, f"❌ Delete failed: {e}", level=messages.ERROR)

        return redirect("admin:resources_resource_change", object_id=obj.pk)

    # -------------------------
    # Low-level storage helpers
    # -------------------------

    def _rename_storage_object(self, obj: Resource, new_name: str):
        """
        Generic rename that works across storages by copy+delete:
          - read old
          - save new
          - delete old
          - update model field
        """
        storage = obj.file.storage
        old_name = obj.file.name

        logger.debug("Reading old object: %s", old_name)
        obj.file.open("rb")
        data = obj.file.read()
        obj.file.close()

        logger.debug("Saving new object: %s (size=%s bytes)", new_name, len(data))
        saved_name = storage.save(new_name, ContentFile(data))
        logger.debug("Saved as: %s", saved_name)

        if storage.exists(old_name):
            logger.debug("Deleting old object: %s", old_name)
            storage.delete(old_name)

        obj.file.name = saved_name
        obj.save(update_fields=["file"])
        logger.info("✅ Rename complete for id=%s: %s", obj.pk, saved_name)
