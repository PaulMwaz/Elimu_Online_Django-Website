from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()

@csrf_exempt
def register_user(request):
    logger.debug("📥 Incoming request to register_user")

    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            logger.debug(f"📦 Payload received: {data}")
        except json.JSONDecodeError:
            logger.error("❌ Invalid JSON in request body")
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        email = data.get("email")
        password = data.get("password")
        full_name = data.get("full_name")

        if not email or not password or not full_name:
            logger.warning("⚠️ Missing required fields in registration")
            return JsonResponse({"error": "Email, password, and full_name are required"}, status=400)

        if User.objects.filter(email=email).exists():
            logger.warning(f"⚠️ Registration failed: Email {email} already exists")
            return JsonResponse({"error": "Email already exists"}, status=400)

        try:
            user = User.objects.create_user(
                email=email,
                password=password,
                full_name=full_name
            )
            logger.info(f"✅ User created successfully: {user.email}")
            return JsonResponse({"message": "Registration successful"}, status=201)
        except Exception as e:
            logger.error(f"❌ Error creating user: {str(e)}")
            return JsonResponse({"error": "Registration failed"}, status=500)

    logger.warning("⚠️ Invalid request method")
    return JsonResponse({"error": "Invalid request"}, status=405)
