from django.urls import path
from .views import (
    get_wallet,
    top_up_wallet,
    initiate_payment,
    payment_confirmation,
    is_resource_paid
)

import logging
logger = logging.getLogger(__name__)

logger.info("✅ DEBUG: payments/urls.py loaded")

# ✅ URL Patterns
urlpatterns = [
    # 💼 Wallet Endpoints
    path('wallet/', get_wallet, name='get_wallet'),
    path('top-up/', top_up_wallet, name='top_up_wallet'),

    # 📲 M-Pesa STK Push + Webhook
    path('initiate/', initiate_payment, name='initiate_payment'),  # 🔁 STK push trigger
    path('confirmation/', payment_confirmation, name='payment_confirmation'),  # 📥 Webhook callback
    path('<int:resource_id>/is-paid-for/', is_resource_paid, name='is_resource_paid'),  # ✅ Access verification
]

# ✅ Log Routes (for deployment debug clarity)
for route in urlpatterns:
    logger.info("🔗 Registered Route → %s: %s", route.name, route.pattern)
