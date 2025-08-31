# server/resources/models.py
import os
import logging
from datetime import timedelta
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

logger = logging.getLogger(__name__)

class Category(models.TextChoices):
    NOTES = "NOTES", "Notes"
    EXAMS = "EXAMS", "Exams"
    EBOOKS = "EBOOKS", "E-Books"
    SCHEMES = "SCHEMES", "Schemes of Work"
    LESSON_PLANS = "LESSON_PLANS", "Lesson Plans"

class Level(models.TextChoices):
    GRADE9 = "GRADE9", "Grade 9"
    FORM2 = "FORM2", "Form 2"
    FORM3 = "FORM3", "Form 3"
    FORM4 = "FORM4", "Form 4"

class Term(models.TextChoices):
    T1 = "T1", "Term 1"
    T2 = "T2", "Term 2"
    T3 = "T3", "Term 3"

class Resource(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    file = models.FileField(upload_to="resources/")

    category = models.CharField(max_length=20, choices=Category.choices)
    level = models.CharField(
        max_length=20, choices=Level.choices, blank=True, null=True
    )
    term = models.CharField(
        max_length=5, choices=Term.choices, blank=True, null=True,
        help_text="Required for Exams, Schemes of Work, and Lesson Plans",
    )

    is_free = models.BooleanField(default=True)
    price = models.DecimalField(
        max_digits=8, decimal_places=2, default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
        help_text="Ksh. Use 0 for free items."
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="resources_uploaded",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["category", "level", "term"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        parts = [self.title, self.get_category_display()]
        if self.level:
            parts.append(self.get_level_display())
        if self.term:
            parts.append(self.get_term_display())
        return " | ".join(parts)

    # ---------- Validation ----------
    def clean(self):
        """Enforce term only for EXAMS/SCHEMES/LESSON_PLANS."""
        categories_requiring_term = {
            Category.EXAMS, Category.SCHEMES, Category.LESSON_PLANS
        }
        if self.category in categories_requiring_term and not self.term:
            from django.core.exceptions import ValidationError
            raise ValidationError({"term": "Term is required for this category."})

    # ---------- URLs ----------
    def get_file_url(self):
        """Return public URL (for public-read objects) or storage URL."""
        url = self.file.url if self.file else None
        logger.debug("📂 get_file_url() %s → %s", self.pk, url)
        return url

    def get_signed_url(self, expiration_minutes=60):
        """Generate a signed URL for temporary access (GCS)."""
        if not self.file:
            logger.warning("⚠️ get_signed_url(): no file for resource id=%s", self.pk)
            return None

        try:
            from google.cloud import storage  # local import avoids import error if package not installed
            # Prefer creds from settings if present; else rely on default ADC.
            if getattr(settings, "GS_CREDENTIALS", None):
                storage_client = storage.Client(credentials=settings.GS_CREDENTIALS)
            else:
                storage_client = storage.Client()

            bucket_name = getattr(settings, "GS_BUCKET_NAME", None)
            if not bucket_name:
                logger.warning("⚠️ get_signed_url(): GS_BUCKET_NAME not configured")
                return None

            blob = storage_client.bucket(bucket_name).blob(self.file.name)
            signed_url = blob.generate_signed_url(
                version="v4",
                expiration=timedelta(minutes=expiration_minutes),
                method="GET",
            )
            logger.info("🔐 Signed URL created for resource id=%s", self.pk)
            return signed_url

        except Exception as e:
            logger.exception("❌ get_signed_url() failed for id=%s: %s", self.pk, e)
            return None

    # ---------- Delete ----------
    def delete(self, *args, **kwargs):
        """Delete the file from storage (GCS/local) then the DB row."""
        file_name = self.file.name if self.file else None
        logger.info("🗑️ Deleting Resource id=%s file=%s", self.pk, file_name)

        try:
            if file_name:
                storage_backend = self.file.storage
                if storage_backend.exists(file_name):
                    storage_backend.delete(file_name)
                    logger.info("✅ File removed from storage: %s", file_name)

                # Optional local cleanup for dev if any local copy exists
                local_path = os.path.join("media", file_name)
                if os.path.exists(local_path):
                    os.remove(local_path)
                    logger.info("🧹 Local file deleted: %s", local_path)
        except Exception as e:
            logger.exception("❌ Exception deleting file for id=%s: %s", self.pk, e)

        super().delete(*args, **kwargs)
