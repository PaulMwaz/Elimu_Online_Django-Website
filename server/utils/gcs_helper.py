import os
from google.cloud import storage
from django.conf import settings
from datetime import timedelta, datetime
from google.auth.transport.requests import Request

# ✅ Initialize the GCS client using service account
credentials = settings.GS_CREDENTIALS
bucket_name = settings.GS_BUCKET_NAME
client = storage.Client(credentials=credentials)
bucket = client.bucket(bucket_name)


def upload_file_to_gcs(local_file_path, gcs_path, content_type="application/octet-stream"):
    """Uploads a file to GCS and makes it public"""
    blob = bucket.blob(gcs_path)
    blob.upload_from_filename(local_file_path, content_type=content_type)

    # ✅ Make public (readable by anyone with the link)
    blob.make_public()

    # ✅ Delete local file after upload
    if os.path.exists(local_file_path):
        os.remove(local_file_path)

    return blob.public_url


def generate_signed_url(gcs_path, expiration_minutes=60):
    """Generate a signed URL for downloading or previewing"""
    blob = bucket.blob(gcs_path)

    if not blob.exists():
        return None

    url = blob.generate_signed_url(
        version="v4",
        expiration=timedelta(minutes=expiration_minutes),
        method="GET"
    )
    return url


def delete_file_from_gcs(gcs_path):
    """Deletes a file from GCS"""
    blob = bucket.blob(gcs_path)

    if blob.exists():
        blob.delete()
        return True
    return False
