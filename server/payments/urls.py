import logging
from django.urls import path
from .views import (
    get_wallet,
    top_up_wallet,
    initiate_payment,
    payment_confirmation,
    is_resource_paid,
)

logger = logging.getLogger(__name__)
logger.debug("✅ payments/urls.py loaded")

app_name = "payments"  # ✅ Namespace for reverse() lookups

urlpatterns = [
    # 💼 Wallet Endpoints
    path("wallet/", get_wallet, name="get_wallet"),
    path("wallet/top-up/", top_up_wallet, name="top_up_wallet"),

    # 📲 M-Pesa STK Push + Webhook
    path("initiate/", initiate_payment, name="initiate_payment"),  # 🔁 STK push trigger
    path("confirmation/", payment_confirmation, name="payment_confirmation"),  # 📥 Webhook callback

    # ✅ Resource unlock verification
    path("<int:resource_id>/is-paid-for/", is_resource_paid, name="is_resource_paid"),
]

# 🔍 Debug log registered routes
for route in urlpatterns:
    logger.debug("🔗 Registered Route → %s: %s", route.name, route.pattern)
