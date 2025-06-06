# payments/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
from django.http import JsonResponse
from django.conf import settings
import logging

from .models import PaidResource, Transaction, Wallet
from resources.models import Resource
from .mpesa import generate_token, lipa_na_mpesa

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wallet(request):
    try:
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        logger.info("💰 Wallet fetched for user %s", request.user.username)
        return Response({'balance': wallet.balance})
    except Exception as e:
        logger.exception("❌ Failed to fetch wallet")
        return Response({'error': 'Wallet fetch failed', 'details': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def top_up_wallet(request):
    try:
        amount = float(request.data.get('amount', 0))
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        wallet.balance += amount
        wallet.save()
        logger.info("💳 Wallet topped up by Ksh %.2f for user %s", amount, request.user.username)
        return Response({'message': f'Wallet topped up by Ksh {amount}', 'balance': wallet.balance})
    except Exception as e:
        logger.exception("❌ Failed to top up wallet")
        return Response({'error': 'Wallet top-up failed', 'details': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    try:
        resource_id = request.data.get("resource_id")
        phone = request.data.get("phone")
        resource = Resource.objects.get(pk=resource_id)

        logger.info("📲 INITIATE_PAYMENT: Resource '%s' → User: %s", resource.title, request.user.username)

        if resource.is_free:
            return Response({'error': 'This resource is free and does not require payment.'}, status=400)

        if PaidResource.objects.filter(user=request.user, resource=resource).exists():
            logger.info("✅ Already paid: %s", resource.title)
            return Response({'message': 'Resource already unlocked'})

        token = generate_token(settings.MPESA_CONSUMER_KEY, settings.MPESA_CONSUMER_SECRET)
        if not token:
            logger.error("❌ Could not generate token")
            return Response({'error': 'Failed to generate M-Pesa token'}, status=500)

        result = lipa_na_mpesa(
            phone=phone,
            amount=resource.price,
            token=token,
            shortcode=settings.MPESA_SHORTCODE,
            passkey=settings.MPESA_PASSKEY,
            title=resource.title
        )

        logger.debug("📤 STK Push Result: %s", result)
        return Response({'message': 'STK Push initiated', 'result': result})

    except Resource.DoesNotExist:
        logger.error("❌ Resource not found (ID: %s)", request.data.get("resource_id"))
        return Response({'error': 'Resource not found'}, status=404)

    except Exception as e:
        logger.exception("❌ Exception during initiate_payment")
        return Response({'error': 'Payment initiation failed', 'details': str(e)}, status=500)


@csrf_exempt
@api_view(['POST'])
def payment_confirmation(request):
    logger.info("📥 PAYMENT_CALLBACK_RECEIVED")
    data = request.data

    try:
        logger.debug("📦 Callback Data: %s", data)

        body = data.get("Body", {})
        stk_callback = body.get("stkCallback", {})
        result_code = stk_callback.get("ResultCode")

        if result_code == 0:
            metadata = stk_callback.get("CallbackMetadata", {}).get("Item", [])
            phone = None
            amount = 0

            for item in metadata:
                if item.get("Name") == "PhoneNumber":
                    phone = item.get("Value")
                elif item.get("Name") == "Amount":
                    amount = item.get("Value")

            logger.info("✅ Payment Success → Phone: %s | Amount: %s", phone, amount)

            Transaction.objects.create(
                user=None,  # Optional: implement logic to assign user via phone
                phone_number=phone,
                amount=amount,
                method="M-Pesa",
                status="Success"
            )

        else:
            logger.warning("⚠️ Payment not successful → ResultCode: %s", result_code)

        return JsonResponse({"message": "Callback received"}, status=200)

    except Exception as e:
        logger.exception("❌ payment_confirmation failed")
        return JsonResponse({"error": "Callback error", "details": str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_resource_paid(request, resource_id):
    try:
        resource = Resource.objects.get(pk=resource_id)
        paid = PaidResource.objects.filter(user=request.user, resource=resource).exists()
        logger.info("🔍 Payment Check → User: %s | Resource: %s | Paid: %s", request.user.username, resource.title, paid)
        return Response({'paid': paid})
    except Resource.DoesNotExist:
        logger.error("❌ is_resource_paid → Resource ID not found: %s", resource_id)
        return Response({'error': 'Resource not found'}, status=404)
