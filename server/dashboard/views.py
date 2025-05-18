from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render
from users.models import User
from resources.models import Resource

@login_required
@user_passes_test(lambda u: u.is_staff)
def admin_dashboard(request):
    return render(request, 'admin_dashboard.html', {
        'users_count': User.objects.count(),
        'files_count': Resource.objects.count(),
        'free_files': Resource.objects.filter(is_free=True).count(),
        'paid_files': Resource.objects.filter(is_free=False).count()
    })
