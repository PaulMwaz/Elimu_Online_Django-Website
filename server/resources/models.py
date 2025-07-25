import os
import logging
from datetime import timedelta
from django.db import models
from django.conf import settings
from google.cloud import storage

logger = logging.getLogger(__name__)

class Resource(models.Model):
    CATEGORY_CHOICES = [
        ("Notes", "Notes"),
        ("Exams", "Exams"),
        ("E-Books", "E-Books"),
        ("Schemes", "Schemes of Work"),
        ("Lesson Plans", "Lesson Plans"),
    ]

    LEVEL_CHOICES = [
        ("Grade 9", "Grade 9"),
        ("Form 2", "Form 2"),
        ("Form 3", "Form 3"),
        ("Form 4", "Form 4"),
    ]

    TERM_CHOICES = [
        ("Term 1", "Term 1"),
        ("Term 2", "Term 2"),
        ("Term 3", "Term 3"),
    ]

    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='resources/')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    level = models.CharField(max_length=50, choices=LEVEL_CHOICES)
    term = models.CharField(
        max_length=50,
        choices=TERM_CHOICES,
        blank=True,
        null=True,
        help_text="Required for Exams, Schemes of Work, and Lesson Plans"
    )
    is_free = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.category} - {self.level} - {self.term or 'No Term'})"

    def get_file_url(self):
        """✅ Return the public URL if available."""
        url = self.file.url if self.file else None
        logger.debug("📂 get_file_url() called for %s → URL: %s", self.title, url)
        return url

    def get_signed_url(self, expiration_minutes=60):
        """🔐 Generate a signed URL for temporary secure file access."""
        if not self.file:
            logger.warning("⚠️ No file found in get_signed_url() for: %s", self.title)
            return None

        try:
            storage_client = storage.Client(credentials=settings.GS_CREDENTIALS)
            bucket = storage_client.bucket(settings.GS_BUCKET_NAME)
            blob = bucket.blob(self.file.name)

            signed_url = blob.generate_signed_url(
                version="v4",
                expiration=timedelta(minutes=expiration_minutes),
                method="GET"
            )
            logger.info("🔐 Signed URL created for %s: %s", self.file.name, signed_url)
            return signed_url

        except Exception as e:
            logger.error("❌ Error creating signed URL for %s: %s", self.file.name, str(e))
            return None

    def delete(self, *args, **kwargs):
        """🗑️ Delete file from Google Cloud Storage and optionally local media."""
        file_name = self.file.name
        logger.info("🗑️ Deleting Resource file: %s", file_name)

        try:
            storage_backend = self.file.storage
            if file_name and storage_backend.exists(file_name):
                logger.debug("🧹 Deleting from GCS...")
                storage_backend.delete(file_name)
                logger.info("✅ File removed from GCS: %s", file_name)

            # Optionally remove from local 'media/' folder (e.g. in dev environments)
            local_path = os.path.join('media', file_name)
            if os.path.exists(local_path):
                os.remove(local_path)
                logger.info("🧹 Local file deleted: %s", local_path)

        except Exception as e:
            logger.exception("❌ Exception deleting file: %s", str(e))

        super().delete(*args, **kwargs)
