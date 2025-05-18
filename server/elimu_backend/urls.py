# elimu_backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

print("✅ DEBUG: elimu_backend/urls.py loaded")

# ✅ Optional root endpoint
def api_root(request):
    return JsonResponse({
        "message": "🎉 Welcome to Elimu-Online API",
        "available_endpoints": {
            "admin": "/admin/",
            "resources": "/api/resources/",
            "users": "/api/users/",
            "token": "/api/token/",
            "token_refresh": "/api/token/refresh/",
            "payments": "/api/payment/",
            "custom_admin": "/admin-panel/",
        }
    })

urlpatterns = [
    path('', api_root),  # ✅ Root API index

    # 🔐 Admin & Admin Panel
    path('admin/', admin.site.urls),
    path('admin-panel/', include('dashboard.urls')),

    # 📚 App Routes
    path('api/resources/', include('resources.urls')),
    path('api/users/', include('users.urls')),
    path('api/payment/', include('payments.urls')),

    # 🔐 JWT Authentication Routes
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

print("✅ DEBUG: urlpatterns loaded:")
for route in urlpatterns:
    print(f"  🔗 {route}")
