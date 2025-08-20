# server/elimu_backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
import logging

# ✅ Setup logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
if not logger.handlers:
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter('%(asctime)s [%(levelname)s] %(message)s'))
    logger.addHandler(handler)

logger.info("✅ DEBUG: elimu_backend/urls.py loaded successfully")

# ✅ Health & root endpoints
def api_root(_request):
    return JsonResponse({
        "message": "🎉 Welcome to Elimu-Online API",
        "available_endpoints": {
            "admin": "/admin/",
            "resources": "/api/resources/",
            "users": "/api/users/",
            "token": "/api/token/",
            "token_refresh": "/api/token/refresh/",
            "payments": "/api/payment/",
            "health": "/api/health/",
            "custom_admin": "/admin-panel/",
        }
    })

def health(_request):
    # Keep it tiny & dependency‑free; ideal for Render health checks & CORS/origin tests
    return JsonResponse({"ok": True})

# ✅ Main URL patterns with debug logs
urlpatterns = []

try:
    # 🛠 Django Admin Panel
    urlpatterns.append(path('admin/', admin.site.urls))
    logger.debug("🔗 Registered route: /admin/")

    # 🧑‍💼 Custom Admin Dashboard (Dashboard App)
    urlpatterns.append(path('admin-panel/', include('dashboard.urls')))
    logger.debug("🔗 Registered route: /admin-panel/")

    # 📦 API Routes (ensure app-level routes use trailing slashes)
    urlpatterns.append(path('api/resources/', include('resources.urls')))
    logger.debug("🔗 Registered route: /api/resources/")

    urlpatterns.append(path('api/users/', include('users.urls')))
    logger.debug("🔗 Registered route: /api/users/")

    urlpatterns.append(path('api/payment/', include('payments.urls')))
    logger.debug("🔗 Registered route: /api/payment/")

    # 🔐 JWT Authentication Routes (optional if you also expose /api/users/login/)
    urlpatterns.append(path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'))
    logger.debug("🔗 Registered route: /api/token/")

    urlpatterns.append(path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'))
    logger.debug("🔗 Registered route: /api/token/refresh/")

    # 🩺 Health
    urlpatterns.append(path('api/health/', health))
    logger.debug("🔗 Registered route: /api/health/")

    # 🎯 Root API Info Endpoint
    urlpatterns.insert(0, path('', api_root, name='api-root'))
    logger.debug("🔗 Registered route: /")

except Exception as e:
    logger.error("❌ Error loading urlpatterns: %s", str(e))

# ✅ Final confirmation
logger.info("✅ All urlpatterns loaded successfully for Elimu-Online backend.")
