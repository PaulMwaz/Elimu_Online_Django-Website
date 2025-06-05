# payments/urls.py

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

urlpatterns = [
    # Wallet APIs
    path('wallet/', get_wallet, name='get_wallet'),
    path('top-up/', top_up_wallet, name='top_up_wallet'),

    # M-Pesa Payment Flow
    path('initiate/', initiate_payment, name='initiate_payment'),  # POST: start checkout
    path('confirmation/', payment_confirmation, name='payment_confirmation'),  # POST webhook
    path('<int:resource_id>/is-paid-for/', is_resource_paid, name='is_resource_paid'),  # GET: check unlock
]

logger.info("✅ DEBUG: payments.urls urlpatterns registered:")
for route in urlpatterns:
    logger.info(f"  🔗 {route.name} → {route.pattern}")
