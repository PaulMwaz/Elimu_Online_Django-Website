import logging
from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Profile

# ✅ Setup logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# ✅ Use the custom user model
User = get_user_model()

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'avatar')
    search_fields = ('user__email', 'user__full_name')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        logger.debug("🔍 Loading ProfileAdmin queryset (Total: %s)", queryset.count())
        return queryset

    def save_model(self, request, obj, form, change):
        logger.info("✅ Saving Profile for user: %s", obj.user.email)
        super().save_model(request, obj, form, change)

    def delete_model(self, request, obj):
        logger.warning("🗑️ Deleting Profile for user: %s", obj.user.email)
        super().delete_model(request, obj)

# ✅ Admin branding
admin.site.site_header = "Elimu-Online Admin"
admin.site.site_title = "Elimu Admin Panel"
admin.site.index_title = "Welcome to the Admin Dashboard"
logger.info("✅ Elimu-Online Admin Panel loaded successfully")
