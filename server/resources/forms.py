# server/resources/forms.py

import logging
import os
from decimal import Decimal, InvalidOperation

from django import forms
from django.conf import settings
from django.core.exceptions import ValidationError

from .models import Resource

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# ---------- Tunables ----------
# You can override these in settings.py if you want.
DEFAULT_MAX_FILE_MB = getattr(settings, "RESOURCE_MAX_FILE_MB", 25)  # 25 MB default
ALLOWED_EXTS = getattr(
    settings,
    "RESOURCE_ALLOWED_EXTS",
    {".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".zip", ".rar", ".txt"},
)
# ------------------------------


class ResourceAdminForm(forms.ModelForm):
    """
    Admin form with strong validation and detailed logging.

    Validates:
      • file is present on create
      • file extension is allowed
      • file size is within limit
      • price logic (free ⇒ 0; paid ⇒ > 0)
      • optional: require "term" for certain categories
    """

    class Meta:
        model = Resource
        fields = "__all__"

    # ------------- Helpers -------------

    @staticmethod
    def _filesize_to_mb(size_bytes: int) -> str:
        try:
            return f"{size_bytes / (1024 * 1024):.2f} MB"
        except Exception:
            return f"{size_bytes} bytes"

    # ------------- Field-level cleans -------------

    def clean_file(self):
        file = self.cleaned_data.get("file")

        # If creating a new resource, a file is required.
        if not self.instance.pk and not file:
            logger.warning("❌ ValidationError: File is required when creating a resource")
            raise ValidationError("A file is required.")

        if not file:
            logger.debug("ℹ️ No new file uploaded (likely editing non-file fields)")
            return file

        # Normalize filename (avoid spaces)
        if " " in file.name:
            old_name = file.name
            file.name = file.name.replace(" ", "_")
            logger.info("⚠️ Normalized filename: '%s' → '%s'", old_name, file.name)

        # Extension check
        _, ext = os.path.splitext(file.name.lower())
        if ext not in ALLOWED_EXTS:
            logger.warning("❌ ValidationError: Disallowed extension '%s'", ext)
            raise ValidationError(
                f"Unsupported file type '{ext}'. "
                f"Allowed: {', '.join(sorted(ALLOWED_EXTS))}"
            )

        # Size check
        max_bytes = DEFAULT_MAX_FILE_MB * 1024 * 1024
        size = getattr(file, "size", 0)
        logger.debug(
            "📦 Uploaded file: name=%s | size=%s | limit=%s MB",
            file.name,
            self._filesize_to_mb(size),
            DEFAULT_MAX_FILE_MB,
        )
        if size and size > max_bytes:
            logger.warning("❌ ValidationError: File too large (%s)", self._filesize_to_mb(size))
            raise ValidationError(
                f"File is too large ({self._filesize_to_mb(size)}). "
                f"Max allowed is {DEFAULT_MAX_FILE_MB} MB."
            )

        return file

    # ------------- Form-wide clean -------------

    def clean(self):
        cleaned_data = super().clean()

        is_free = cleaned_data.get("is_free")
        price = cleaned_data.get("price")
        category = cleaned_data.get("category")
        term = cleaned_data.get("term")

        logger.debug(
            "🧼 Cleaning form data → is_free=%s | price=%s | category=%s | term=%s",
            is_free,
            price,
            category,
            term,
        )

        # --- Price logic ---
        if is_free:
            # Force price to 0.00 for free resources
            cleaned_data["price"] = Decimal("0.00")
            logger.info("💸 Free resource → coerced price to 0.00")
        else:
            # Paid resource must have price > 0
            if price is None:
                logger.warning("❌ ValidationError: Paid resource missing price")
                raise ValidationError("Paid resources must have a price.")
            try:
                price_dec = Decimal(price)
            except (InvalidOperation, TypeError) as e:
                logger.warning("❌ ValidationError: Invalid price value (%s)", e)
                raise ValidationError("Price must be a valid number.")

            if price_dec <= 0:
                logger.warning("❌ ValidationError: Non-positive price for paid resource")
                raise ValidationError("Paid resources must have a price greater than 0.")

            # Keep two decimal places
            cleaned_data["price"] = price_dec.quantize(Decimal("0.01"))
            logger.debug("💵 Normalized price → %s", cleaned_data["price"])

        # --- Optional business rule: require term for certain categories ---
        # Adjust the set below to match your site's rules.
        categories_requiring_term = {"Exams", "Schemes of Work", "Lesson Plans"}
        if category in categories_requiring_term and not term:
            logger.warning("❌ ValidationError: Term required for category '%s'", category)
            raise ValidationError(f"Term is required for the ‘{category}’ category.")

        logger.info("✅ ResourceAdminForm passed validation.")
        return cleaned_data

    # ------------- Init logging -------------

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        mode = "edit" if self.instance and self.instance.pk else "create"
        logger.debug(
            "📝 ResourceAdminForm init (%s) → instance.id=%s, title=%s",
            mode,
            getattr(self.instance, "pk", None),
            getattr(self.instance, "title", None),
        )
