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

# URL patterns
urlpatterns = [
    # Wallet APIs
    path('wallet/', get_wallet, name='get_wallet'),
    path('top-up/', top_up_wallet, name='top_up_wallet'),

    # M-Pesa Payment Flow
    path('initiate/', initiate_payment, name='initiate_payment'),  # 🔄 Initiates STK Push
    path('confirmation/', payment_confirmation, name='payment_confirmation'),  # 📥 M-Pesa webhook
    path('<int:resource_id>/is-paid-for/', is_resource_paid, name='is_resource_paid'),  # ✅ Access check
]

# 🔍 Log the registered routes for debug clarity
logger.info("✅ DEBUG: Registered URL patterns in payments.urls:")
for route in urlpatterns:
    logger.info(f"  🔗 Route name: {route.name} → Path: {route.pattern}")
