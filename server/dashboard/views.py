# dashboard/views.py

from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render
from users.models import User
from resources.models import Resource
import logging

logger = logging.getLogger(__name__)

@login_required
@user_passes_test(lambda u: u.is_staff)
def admin_dashboard(request):
    try:
        logger.debug("📊 Accessing admin dashboard view")

        users_count = User.objects.count()
        files_count = Resource.objects.count()
        free_files = Resource.objects.filter(is_free=True).count()
        paid_files = Resource.objects.filter(is_free=False).count()

        logger.debug(f"✔️ User count: {users_count}")
        logger.debug(f"✔️ Total files: {files_count} (Free: {free_files}, Paid: {paid_files})")

        return render(request, 'admin_dashboard.html', {
            'users_count': users_count,
            'files_count': files_count,
            'free_files': free_files,
            'paid_files': paid_files
        })

    except Exception as e:
        logger.error(f"❌ Error rendering admin dashboard: {e}", exc_info=True)
        return render(request, 'admin_dashboard.html', {
            'error': 'An error occurred while loading the dashboard.'
        })
