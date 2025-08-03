import logging
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import UserSerializer

# ✅ Logger setup
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

User = get_user_model()  # ✅ Custom user model

# ========================================
# 🔐 Admin-only: View all registered users
# ========================================
class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        logger.debug("👮 Admin fetched user list.")
        return super().get_queryset()

# ========================================
# ✅ Public: Register a new user
# ========================================
@api_view(['POST', 'OPTIONS'])
@permission_classes([AllowAny])
def register_user(request):
    if request.method == "OPTIONS":
        logger.debug("🔁 CORS Preflight OPTIONS request at /users/register/")
        return Response(status=status.HTTP_200_OK)

    logger.debug("📥 Registration payload: %s", request.data)
    data = request.data.copy()

    # 🔁 Map frontend "name" to "full_name"
    if 'name' in data:
        data['full_name'] = data.pop('name')

    email = data.get("email")
    password = data.get("password")
    full_name = data.get("full_name", "")

    if not email or not password:
        logger.warning("❌ Registration failed: Missing email or password.")
        return Response(
            {"message": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        logger.warning("⚠️ User already exists: %s", email)
        return Response(
            {"message": "User already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.create_user(
            email=email,
            password=password,
            full_name=full_name
        )
        logger.info("✅ New user registered: %s", user.email)
    except Exception:
        logger.exception("🔥 Exception while creating user:")
        return Response(
            {"message": "Registration failed due to a server error."},
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

# ========================================
# ✅ Public: Login with JWT using email
# ========================================
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        logger.debug("🔐 Login attempt → Email: %s", email)

        if not email or not password:
            logger.warning("❌ Login failed: Missing email or password.")
            return Response(
                {"message": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Email-based authentication
        user = authenticate(request, username=email, password=password)

        if user is None:
            logger.warning("❌ Login failed: Invalid credentials for email: %s", email)
            return Response(
                {"message": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        logger.info("✅ Login successful: %s", email)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "name": user.full_name,
                "email": user.email,
            },
        }, status=status.HTTP_200_OK)
