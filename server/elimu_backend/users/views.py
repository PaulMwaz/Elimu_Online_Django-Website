from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from django.contrib.auth import get_user_model

User = get_user_model()

@csrf_exempt
def register_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        full_name = data.get("full_name")

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=400)

        user = User.objects.create_user(email=email, password=password, full_name=full_name)
        return JsonResponse({"message": "Registration successful"}, status=201)

    return JsonResponse({"error": "Invalid request"}, status=405)
