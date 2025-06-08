import os
import logging
from google.cloud import storage
from django.conf import settings
from datetime import timedelta

logger = logging.getLogger(__name__)

# ✅ Initialize the GCS client
try:
    credentials = settings.GS_CREDENTIALS
    bucket_name = settings.GS_BUCKET_NAME
    client = storage.Client(credentials=credentials)
    bucket = client.bucket(bucket_name)
    logger.debug("✅ GCS client initialized with bucket: %s", bucket_name)
except Exception as e:
    logger.error("❌ Error initializing GCS client: %s", str(e))
    bucket = None


def upload_file_to_gcs(local_file_path, gcs_path, content_type="application/octet-stream"):
    """
    📤 Uploads a file to Google Cloud Storage:
    - Uploads with optional MIME type
    - Makes file publicly accessible
    - Deletes local file after upload
    """
    logger.info("📤 Uploading file to GCS: %s → %s", local_file_path, gcs_path)

    try:
        blob = bucket.blob(gcs_path)
        blob.upload_from_filename(local_file_path, content_type=content_type)
        blob.make_public()
        logger.debug("✅ Upload complete. Public URL: %s", blob.public_url)

        # Clean up local file
        if os.path.exists(local_file_path):
            os.remove(local_file_path)
            logger.debug("🧹 Local file deleted: %s", local_file_path)

        return blob.public_url

    except Exception as e:
        logger.error("❌ Failed to upload file to GCS: %s", str(e))
        return None


def generate_signed_url(gcs_path, expiration_minutes=60):
    """
    🔐 Generates a signed URL for secure temporary file access.
    """
    logger.debug("🔐 Generating signed URL for: %s", gcs_path)

    try:
        blob = bucket.blob(gcs_path)

        if not blob.exists():
            logger.warning("⚠️ File does not exist in GCS: %s", gcs_path)
            return None

        url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(minutes=expiration_minutes),
            method="GET",
        )
        logger.debug("✅ Signed URL: %s", url)
        return url

    except Exception as e:
        logger.error("❌ Failed to generate signed URL: %s", str(e))
        return None


def delete_file_from_gcs(gcs_path):
    """
    🗑️ Deletes a file from GCS if it exists.
    """
    logger.info("🗑️ Attempting to delete file from GCS: %s", gcs_path)

    try:
        blob = bucket.blob(gcs_path)

        if blob.exists():
            blob.delete()
            logger.info("✅ File deleted: %s", gcs_path)
            return True
        else:
            logger.warning("⚠️ File not found: %s", gcs_path)
            return False

    except Exception as e:
        logger.error("❌ Error deleting file from GCS: %s", str(e))
        return False
