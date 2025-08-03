import logging
from django.urls import path
from .views import UserListView, register_user, LoginView

# ✅ Setup logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# ✅ Confirm file load
logger.info("✅ DEBUG: users/urls.py loaded successfully.")

# ✅ User-related routes
urlpatterns = [
    # 🔐 Admin-only: View all users
    path('', UserListView.as_view(), name='user-list'),

    # ✅ Public: Registration endpoint
    path('register/', register_user, name='user-register'),

    # 🌐 Optional: Backward-compatible registration path
    path('auth/register/', register_user, name='legacy-register'),

    # 🔐 Public: Login via email + JWT
    path('auth/login/', LoginView.as_view(), name='user-login'),
]

# ✅ Log all registered user routes if in DEBUG mode
if logger.isEnabledFor(logging.DEBUG):
    for route in urlpatterns:
        try:
            logger.debug("🔗 Registered user route: /api/users/%s → View: %s",
                         route.pattern.describe(), route.callback.__name__)
        except Exception as e:
            logger.warning("⚠️ Route logging error for %s → %s", route, str(e))
