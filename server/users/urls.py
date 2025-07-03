from django.urls import path
from .views import UserListView, register_user, LoginView

import logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.info("✅ DEBUG: users/urls.py loaded successfully.")

urlpatterns = [
    # 🔐 Admin-only list of users
    path('', UserListView.as_view(), name='user-list'),

    # ✅ Public registration route
    path('register/', register_user, name='user-register'),

    # 🌐 Optional legacy route (backward-compatible)
    path('auth/register/', register_user),

    # 🔐 Login view
    path('auth/login/', LoginView.as_view(), name='user-login'),
]

# ✅ Log all registered user endpoints
for route in urlpatterns:
    logger.debug("🔗 Registered user URL: /api/users/%s → %s", route.pattern, route.callback)
