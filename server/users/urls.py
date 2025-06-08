from django.urls import path
from .views import UserListView, register_user, LoginView

import logging
logger = logging.getLogger(__name__)
logger.info("✅ DEBUG: users/urls.py loaded successfully.")

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),                  # 🔐 Admin-only list
    path('register/', register_user, name='user-register'),             # ✅ Clean public register
    path('auth/register/', register_user),                              # 🌐 Optional legacy route
    path('auth/login/', LoginView.as_view(), name='user-login'),        # 🌐 JWT login
]

# ✅ Log all URL patterns (good for container builds, CI, and debugging)
for u in urlpatterns:
    logger.info("🔗 Registered URL pattern: /api/users/%s", u.pattern)
