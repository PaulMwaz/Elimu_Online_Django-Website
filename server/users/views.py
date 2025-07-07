from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .serializers import UserSerializer

import logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# 🔐 Admin-only: View all users
class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        logger.debug("👮 Admin fetched user list.")
        return super().get_queryset()


# ✅ Public: Register a new user (POST + CORS OPTIONS)
@api_view(['POST', 'OPTIONS'])
@permission_classes([AllowAny])
def register_user(request):
    if request.method == "OPTIONS":
        logger.debug("🔁 CORS Preflight OPTIONS request received at /users/register/")
        return Response(status=status.HTTP_200_OK)

    logger.debug("📥 Registration data received: %s", request.data)
    data = request.data

    email = data.get("email")
    password = data.get("password")
    name = data.get("name", "")

    if not email or not password:
        logger.warning("❌ Missing email or password during registration.")
        return Response(
            {"message": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=email).exists():
        logger.warning("⚠️ Duplicate registration attempt for email: %s", email)
        return Response(
            {"message": "User already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name
        )
        logger.info("✅ User registered successfully: %s", user.username)
    except Exception as e:
        logger.error("🔥 Error creating user: %s", str(e))
        return Response(
            {"message": "Registration failed."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    serializer = UserSerializer(user)
    return Response(
        {
            "message": "User registered successfully.",
            "user": serializer.data
        },
        status=status.HTTP_201_CREATED
    )


# ✅ Public: JWT Login
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        logger.debug("🔐 Login attempt for email: %s", email)

        if not email or not password:
            logger.warning("❌ Missing email or password during login.")
            return Response(
                {"message": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            logger.warning("❌ Login failed - email not found: %s", email)
            return Response(
                {"message": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = authenticate(username=user.username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            logger.info("✅ Login successful for: %s", email)
            return Response({
                "token": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "name": user.get_full_name(),
                    "email": user.email,
                },
            })

        logger.warning("❌ Login failed - incorrect password for: %s", email)
        return Response(
            {"message": "Invalid credentials."},
            status=status.HTTP_401_UNAUTHORIZED
        )
