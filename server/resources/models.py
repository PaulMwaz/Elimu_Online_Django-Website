import os
from django.db import models
from google.cloud import storage
from django.conf import settings
from datetime import timedelta
from google.cloud.storage.blob import Blob
from google.auth.transport.requests import Request
from google.auth import compute_engine
from django.utils import timezone


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
        ("Term 1", "Term 1"),
        ("Term 2", "Term 2"),
        ("Term 3", "Term 3"),
    ]

    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='resources/')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    level = models.CharField(max_length=50, choices=LEVEL_CHOICES)
    is_free = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.category} - {self.level})"

    def get_file_url(self):
        """✅ Returns public URL (if file is publicly accessible)."""
        return self.file.url if self.file else None

    def get_signed_url(self, expiration_minutes=60):
        """✅ Generate a signed URL that expires in X minutes (default 60)."""
        if not self.file:
            return None

        storage_client = storage.Client(credentials=settings.GS_CREDENTIALS)
        bucket = storage_client.bucket(settings.GS_BUCKET_NAME)
        blob = bucket.blob(self.file.name)

        url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(minutes=expiration_minutes),
            method="GET",
        )
        return url

    def delete(self, *args, **kwargs):
        """
        ✅ Deletes the file from Google Cloud Storage and local folder if any.
        """
        storage_backend = self.file.storage
        file_name = self.file.name

        # Delete from GCS
        if file_name and storage_backend.exists(file_name):
            storage_backend.delete(file_name)

        # Optional local cleanup
        local_path = os.path.join('media', file_name)
        if os.path.exists(local_path):
            os.remove(local_path)

        super().delete(*args, **kwargs)
