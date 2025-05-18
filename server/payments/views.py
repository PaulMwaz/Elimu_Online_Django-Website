from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Wallet, Transaction
from django.contrib.auth.models import User
from .mpesa import generate_token, lipa_na_mpesa

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wallet(request):
    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    return Response({'balance': wallet.balance})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def top_up_wallet(request):
    amount = float(request.data.get('amount'))
    method = request.data.get('method')  # mpesa or manual
    phone = request.data.get('phone')

    if method == 'mpesa':
        token = generate_token("YOUR_CONSUMER_KEY", "YOUR_CONSUMER_SECRET")
        response = lipa_na_mpesa(phone, amount, "https://yourdomain.com/api/payment/confirmation/",
                                 token, "YOUR_SHORTCODE", "YOUR_PASSKEY")
        return Response({'message': 'M-Pesa request sent', 'response': response})
    else:
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        wallet.balance += amount
        wallet.save()
        Transaction.objects.create(user=request.user, amount=amount, method="Manual", status="Success")
        return Response({'message': 'Wallet topped up manually'})
