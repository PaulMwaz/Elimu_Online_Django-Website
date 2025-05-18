from django.urls import path
from .views import UserListView, register_user, LoginView

print("✅ DEBUG: users/urls.py loaded successfully.")

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),                 # 🔐 Admin-only
    path('register/', register_user, name='user-register'),            # ✅ Clean URL (frontend default)
    path('auth/register/', register_user),                             # 🌐 Optional legacy route
    path('auth/login/', LoginView.as_view(), name='user-login'),       # 🌐 JWT login
]

# ✅ Print patterns for live confirmation
for u in urlpatterns:
    print(f"🔗 Registered URL pattern: /api/users/{u.pattern}")
