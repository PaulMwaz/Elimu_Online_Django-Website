# payments/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Wallet, Transaction
from .mpesa import generate_token, lipa_na_mpesa
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

CALLBACK_URL = "https://773c-41-139-193-51.ngrok-free.app/api/payment/confirmation/"  # ✅ Update for live deployment

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wallet(request):
    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    logger.info("👛 Wallet queried for user %s → Balance: %s", request.user.username, wallet.balance)
    return Response({'balance': wallet.balance})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def top_up_wallet(request):
    try:
        amount = float(request.data.get('amount'))
        method = request.data.get('method')  # 'mpesa' or 'manual'
        phone = request.data.get('phone', '').strip()

        logger.info("💰 Wallet top-up request: method=%s, amount=%s, phone=%s, user=%s",
                    method, amount, phone, request.user.username)

        if amount <= 0:
            return Response({'error': 'Amount must be greater than zero'}, status=400)

        if method == 'mpesa':
            token = generate_token(
                settings.MPESA_CONSUMER_KEY,
                settings.MPESA_CONSUMER_SECRET
            )
            if not token:
                return Response({'error': 'Failed to generate M-Pesa token'}, status=500)

            result = lipa_na_mpesa(
                phone=phone,
                amount=amount,
                callback_url=CALLBACK_URL,
                token=token,
                shortcode=settings.MPESA_SHORTCODE,
                passkey=settings.MPESA_PASSKEY
            )
            return Response({'message': 'M-Pesa request sent', 'response': result})

        else:
            wallet, _ = Wallet.objects.get_or_create(user=request.user)
            wallet.balance += amount
            wallet.save()
            Transaction.objects.create(
                user=request.user,
                amount=amount,
                method="Manual",
                status="Success"
            )
            logger.info("✅ Manual top-up success for user %s → New balance: %s", request.user.username, wallet.balance)
            return Response({'message': 'Wallet topped up manually', 'balance': wallet.balance})

    except Exception as e:
        logger.exception("❌ Error processing top-up request")
        return Response({'error': 'Something went wrong', 'details': str(e)}, status=500)
