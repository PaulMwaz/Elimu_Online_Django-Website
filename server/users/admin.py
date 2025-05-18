from django.contrib import admin
from django.contrib.auth.models import User
from .models import Profile

# ✅ Register the Profile model for admin view
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'avatar')
    search_fields = ('user__username',)

# ✅ Customize the Admin Panel headers
admin.site.site_header = "Elimu-Online Admin"
admin.site.site_title = "Elimu Admin Panel"
admin.site.index_title = "Welcome to the Admin Dashboard"
