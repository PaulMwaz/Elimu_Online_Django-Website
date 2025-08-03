import logging
from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# ✅ Setup logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

User = get_user_model()

# ✅ Custom Token Serializer for Email Login
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD  # ✅ Ensures email is used instead of username

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        logger.info("🔐 Attempting login for email: %s", email)

        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if not user:
            logger.warning("❌ Invalid login attempt for email: %s", email)
            raise serializers.ValidationError("Invalid credentials")

        logger.info("✅ Login successful for user ID: %s", user.id)

        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
            }
        }

# ✅ User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']
        extra_kwargs = {
            'full_name': {'required': False},
            'email': {'required': True}
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        logger.debug("📤 Serializing user → ID: %s | Email: %s | Full Name: %s", instance.id, instance.email, instance.full_name)
        return data

    def create(self, validated_data):
        email = validated_data.get("email", "<missing>")
        full_name = validated_data.get("full_name", "<missing>")
        logger.info("👤 Creating new user → Email: %s | Name: %s", email, full_name)

        try:
            instance = User.objects.create_user(**validated_data)
            logger.debug("✅ User created successfully: ID %s", instance.id)
            return instance
        except Exception:
            logger.exception("❌ Error creating user")
            raise serializers.ValidationError("User creation failed.")

    def update(self, instance, validated_data):
        logger.info("✏️ Updating user → ID: %s | Email: %s", instance.id, instance.email)
        try:
            instance = super().update(instance, validated_data)
            logger.debug("✅ User updated successfully: ID %s", instance.id)
            return instance
        except Exception as e:
            logger.error("❌ Error updating user %s: %s", instance.email, str(e))
            raise serializers.ValidationError("User update failed.")
