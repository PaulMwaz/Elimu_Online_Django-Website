import logging
from decimal import Decimal, InvalidOperation
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import PaidResource, Transaction, Wallet
from resources.models import Resource
from .mpesa import generate_token, lipa_na_mpesa

logger = logging.getLogger(__name__)


# ✅ Get Wallet Balance
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_wallet(request):
    try:
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        logger.info("💰 Wallet fetched for user=%s", request.user)
        return Response({"balance": wallet.balance})
    except Exception as e:
        logger.exception("❌ Wallet fetch failed")
        return Response({"error": "Wallet fetch failed", "details": str(e)}, status=500)


# ✅ Top Up Wallet (Manual - For testing/demo)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def top_up_wallet(request):
    try:
        raw = request.data.get("amount", "0")
        amount = Decimal(str(raw))
        if amount <= 0:
            return Response({"error": "Amount must be greater than 0"}, status=400)

        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        wallet.balance += amount
        wallet.save()
        logger.info("💳 Wallet top-up Ksh %s for user=%s", amount, request.user)
        return Response({"message": f"Wallet topped up by Ksh {amount}", "balance": wallet.balance})
    except (InvalidOperation, TypeError):
        return Response({"error": "Invalid amount"}, status=400)
    except Exception as e:
        logger.exception("❌ Wallet top-up failed")
        return Response({"error": "Wallet top-up failed", "details": str(e)}, status=500)


# ✅ Initiate M-Pesa Payment
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    try:
        resource_id = request.data.get("resource_id")
        phone = request.data.get("phone")

        if not resource_id or not phone:
            return Response({"error": "resource_id and phone are required"}, status=400)

        resource = Resource.objects.get(pk=resource_id)

        logger.info("📲 STK Push start → user=%s | resource='%s' | price=%s",
                    request.user, resource.title, resource.price)

        if resource.is_free:
            return Response({"error": "This resource is free and does not require payment."}, status=400)

        if PaidResource.objects.filter(user=request.user, resource=resource).exists():
            logger.info("✅ Already paid → user=%s | resource=%s", request.user, resource_id)
            return Response({"message": "Resource already unlocked"})

        token = generate_token()
        if not token:
            logger.error("❌ Failed to generate M-Pesa token")
            return Response({"error": "Failed to generate M-Pesa token"}, status=500)

        # 🔗 Put user+resource into AccountReference for callback linkage
        account_ref = f"{request.user.id}:{resource.id}"

        result = lipa_na_mpesa(
            phone=phone,
            amount=str(resource.price),          # Safest to pass str for JSON → API
            token=token,
            title=resource.title,
            account_reference=account_ref,       # <-- needs helper minor patch below
        )

        logger.debug("📤 STK Push Result: %s", result)
        if isinstance(result, dict) and result.get("error"):
            return Response({"error": "STK push failed", "details": result}, status=502)

        return Response({"message": "STK Push initiated", "result": result})

    except Resource.DoesNotExist:
        logger.error("❌ Resource not found (ID: %s)", request.data.get("resource_id"))
        return Response({"error": "Resource not found"}, status=404)
    except Exception as e:
        logger.exception("❌ Exception during initiate_payment")
        return Response({"error": "Payment initiation failed", "details": str(e)}, status=500)


# ✅ M-Pesa Callback Handler
@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])  # Webhook is called by Safaricom; no auth
def payment_confirmation(request):
    logger.info("📥 PAYMENT CALLBACK RECEIVED")
    data = request.data

    try:
        logger.debug("📦 Callback Raw Data: %s", data)

        body = data.get("Body", {})
        stk_callback = body.get("stkCallback", {})
        result_code = stk_callback.get("ResultCode")
        merchant_id = stk_callback.get("MerchantRequestID")
        checkout_id = stk_callback.get("CheckoutRequestID")

        if result_code == 0:
            # Pull key metadata
            metadata = stk_callback.get("CallbackMetadata", {}).get("Item", [])
            phone = None
            amount = Decimal("0")
            for item in metadata:
                if item.get("Name") == "PhoneNumber":
                    phone = str(item.get("Value"))
                elif item.get("Name") == "Amount":
                    amount = Decimal(str(item.get("Value")))

            # 🔗 Recover user & resource via AccountReference
            # Safaricom will echo AccountReference we sent in the initiating payload.
            account_ref = None
            for item in metadata:
                if item.get("Name") == "AccountReference":
                    account_ref = str(item.get("Value"))
                    break

            user = None
            resource = None
            if account_ref and ":" in account_ref:
                try:
                    user_id_str, res_id_str = account_ref.split(":", 1)
                    from django.contrib.auth import get_user_model
                    User = get_user_model()
                    user = User.objects.filter(id=int(user_id_str)).first()
                    resource = Resource.objects.filter(id=int(res_id_str)).first()
                except Exception as e:
                    logger.warning("⚠️ Failed to parse AccountReference '%s': %s", account_ref, e)

            logger.info("✅ Payment Success → phone=%s | amount=%s | user=%s | resource=%s",
                        phone, amount, user, resource)

            # Record transaction
            try:
                Transaction.objects.create(
                    user=user if user else None,
                    amount=amount,
                    method="M-Pesa",
                    status="Success",
                )
            except Exception as e:
                logger.warning("⚠️ Could not create Transaction row: %s", e)

            # Unlock resource
            if user and resource:
                PaidResource.objects.get_or_create(user=user, resource=resource)
                logger.info("🔓 Resource unlocked → user=%s | resource=%s", user.id, resource.id)
            else:
                logger.warning("⚠️ Missing user/resource, cannot unlock automatically.")

        else:
            logger.warning("⚠️ Payment failed/cancelled → ResultCode=%s | msg=%s",
                           result_code, stk_callback.get("ResultDesc"))
            try:
                Transaction.objects.create(
                    user=None,
                    amount=Decimal("0.00"),
                    method="M-Pesa",
                    status="Failed",
                )
            except Exception:
                pass

        return Response({"message": "Callback received"}, status=200)

    except Exception as e:
        logger.exception("❌ Error in payment_confirmation")
        return Response({"error": "Callback error", "details": str(e)}, status=500)


# ✅ Check If Resource is Paid
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def is_resource_paid(request, resource_id):
    try:
        resource = Resource.objects.get(pk=resource_id)
        paid = PaidResource.objects.filter(user=request.user, resource=resource).exists()
        logger.info("🔍 Payment Check → user=%s | resource=%s | paid=%s",
                    request.user, resource.title, paid)
        return Response({"paid": paid})
    except Resource.DoesNotExist:
        logger.error("❌ Resource not found during payment check → ID=%s", resource_id)
        return Response({"error": "Resource not found"}, status=404)
