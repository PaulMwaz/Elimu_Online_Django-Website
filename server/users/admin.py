import logging
from django.contrib import admin
from django.contrib.auth.models import User
from .models import Profile

logger = logging.getLogger(__name__)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'avatar')
    search_fields = ('user__username',)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        logger.debug("🔍 Loading ProfileAdmin queryset (Total: %s)", queryset.count())
        return queryset

    def save_model(self, request, obj, form, change):
        logger.info("✅ Saving Profile for user: %s", obj.user.username)
        super().save_model(request, obj, form, change)

    def delete_model(self, request, obj):
        logger.warning("🗑️ Deleting Profile for user: %s", obj.user.username)
        super().delete_model(request, obj)

# ✅ Customize the Admin Panel headers for branding
admin.site.site_header = "Elimu-Online Admin"
admin.site.site_title = "Elimu Admin Panel"
admin.site.index_title = "Welcome to the Admin Dashboard"
logger.info("✅ Elimu-Online Admin Panel loaded successfully")
