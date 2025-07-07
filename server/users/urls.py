from django.urls import path
from .views import UserListView, register_user, LoginView

import logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

logger.info("✅ DEBUG: users/urls.py loaded successfully.")

urlpatterns = [
    # 🔐 Admin-only: list all users
    path('', UserListView.as_view(), name='user-list'),

    # ✅ Public: User registration endpoint
    path('register/', register_user, name='user-register'),

    # 🌐 Optional: Legacy/alternative registration path (backward-compatible)
    path('auth/register/', register_user, name='legacy-register'),

    # 🔐 Public: Login endpoint using JWT
    path('auth/login/', LoginView.as_view(), name='user-login'),
]

# ✅ Log all registered user routes (only in DEBUG mode)
if logger.isEnabledFor(logging.DEBUG):
    for route in urlpatterns:
        logger.debug("🔗 Registered user URL: /api/users/%s → %s", route.pattern, route.callback)
