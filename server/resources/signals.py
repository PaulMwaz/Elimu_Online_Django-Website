import logging
from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Resource

logger = logging.getLogger(__name__)

@receiver(post_delete, sender=Resource)
def delete_file_on_resource_delete(sender, instance, **kwargs):
    """
    🗑️ Deletes associated file from storage when a Resource is deleted.
    Works with both local and GCS storage.
    """
    try:
        if instance.file:
            logger.info("🗑️ Signal: Deleting file from storage for resource '%s'", instance.title)
            instance.file.delete(save=False)
            logger.debug("✅ File deleted for resource '%s': %s", instance.title, instance.file.name)
        else:
            logger.warning("⚠️ Signal: No file found for resource '%s'", instance.title)
    except Exception as e:
        logger.error("❌ Signal: Failed to delete file for '%s': %s", instance.title, str(e))
