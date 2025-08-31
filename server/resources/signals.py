import logging
from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Resource

logger = logging.getLogger(__name__)

@receiver(post_delete, sender=Resource)
def delete_file_on_resource_delete(sender, instance, **kwargs):
    """
    🗑️ Deletes associated file from storage when a Resource is deleted.
    Works with both local media and Google Cloud Storage.
    """
    try:
        if instance.file and instance.file.name:
            fname = instance.file.name
            logger.info("🗑️ Signal: Deleting file for resource '%s' → %s", instance.title, fname)
            instance.file.delete(save=False)
            logger.debug("✅ File deleted for resource '%s': %s", instance.title, fname)
        else:
            logger.warning("⚠️ Signal: No file to delete for resource '%s'", instance.title)
    except Exception as e:
        logger.exception("❌ Signal: Failed to delete file for resource '%s': %s", instance.title, e)
