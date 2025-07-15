import logging
from django.contrib.auth import get_user_model
from rest_framework import serializers

# ✅ Setup logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

User = get_user_model()  # ✅ Use custom user model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'full_name',
            'date_joined',
        ]
        read_only_fields = ['id', 'date_joined']
        extra_kwargs = {
            'full_name': {'required': False},
            'email': {'required': True}
        }

    def to_representation(self, instance):
        """
        ✅ Convert model instance to JSON-compatible dict.
        """
        data = super().to_representation(instance)
        logger.debug(
            "📤 Serializing user → ID: %s | Email: %s | Full Name: %s",
            instance.id, instance.email, instance.full_name
        )
        return data

    def create(self, validated_data):
        """
        ✅ Log new user creation attempt and pass to super.
        """
        email = validated_data.get("email", "<missing>")
        full_name = validated_data.get("full_name", "<missing>")
        logger.info("👤 Creating new user → Email: %s | Name: %s", email, full_name)

        try:
            instance = User.objects.create_user(**validated_data)
            logger.debug("✅ User created successfully: ID %s", instance.id)
            return instance
        except Exception as e:
            logger.exception("❌ Error creating user")
            raise serializers.ValidationError("User creation failed.")

    def update(self, instance, validated_data):
        """
        ✅ Log user update attempt and pass to super.
        """
        logger.info("✏️ Updating user → ID: %s | Email: %s", instance.id, instance.email)
        try:
            instance = super().update(instance, validated_data)
            logger.debug("✅ User updated successfully: ID %s", instance.id)
            return instance
        except Exception as e:
            logger.error("❌ Error updating user %s: %s", instance.email, str(e))
            raise serializers.ValidationError("User update failed.")
