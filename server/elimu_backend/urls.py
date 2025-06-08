# elimu_backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
import logging

# ✅ Setup logger
logger = logging.getLogger(__name__)
logger.info("✅ DEBUG: elimu_backend/urls.py loaded successfully")

# ✅ Optional API root endpoint
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

# ✅ Main URL patterns
urlpatterns = [
    path('', api_root, name='api-root'),

    # 🛠 Django Admin Panel
    path('admin/', admin.site.urls),

    # 🧑‍💼 Custom Admin Dashboard (Dashboard App)
    path('admin-panel/', include('dashboard.urls')),

    # 📦 API Routes
    path('api/resources/', include('resources.urls')),
    path('api/users/', include('users.urls')),
    path('api/payment/', include('payments.urls')),

    # 🔐 JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# ✅ Log all registered routes (for deployment debugging)
logger.debug("✅ DEBUG: urlpatterns loaded:")
for route in urlpatterns:
    logger.debug(f"🔗 {route}")
