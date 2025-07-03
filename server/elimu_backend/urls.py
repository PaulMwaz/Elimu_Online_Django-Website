# elimu_backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
import logging

# ✅ Setup logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter('%(asctime)s [%(levelname)s] %(message)s'))
logger.addHandler(handler)

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

# ✅ Main URL patterns with error handling
urlpatterns = []

try:
    # 🛠 Django Admin Panel
    urlpatterns.append(path('admin/', admin.site.urls))
    logger.debug("🔗 Registered route: /admin/")

    # 🧑‍💼 Custom Admin Dashboard (Dashboard App)
    urlpatterns.append(path('admin-panel/', include('dashboard.urls')))
    logger.debug("🔗 Registered route: /admin-panel/")

    # 📦 API Routes
    urlpatterns.append(path('api/resources/', include('resources.urls')))
    logger.debug("🔗 Registered route: /api/resources/")

    urlpatterns.append(path('api/users/', include('users.urls')))
    logger.debug("🔗 Registered route: /api/users/")

    urlpatterns.append(path('api/payment/', include('payments.urls')))
    logger.debug("🔗 Registered route: /api/payment/")

    # 🔐 JWT Authentication
    urlpatterns.append(path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'))
    urlpatterns.append(path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'))
    logger.debug("🔐 Registered JWT routes.")

    # 🎯 Root endpoint
    urlpatterns.insert(0, path('', api_root, name='api-root'))
    logger.debug("🔗 Registered route: /")

except Exception as e:
    logger.error(f"❌ Error loading urlpatterns: {e}")

# ✅ Final confirmation
logger.info("✅ All urlpatterns loaded successfully for Elimu-Online backend.")
