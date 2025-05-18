from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Resource

@receiver(post_delete, sender=Resource)
def delete_file_on_resource_delete(sender, instance, **kwargs):
    if instance.file:
        instance.file.delete(save=False)
