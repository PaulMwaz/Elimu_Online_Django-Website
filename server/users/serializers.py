import logging
from django.contrib.auth.models import User
from rest_framework import serializers

# ✅ Setup logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'date_joined',
        ]
        read_only_fields = ['id', 'date_joined']

    def to_representation(self, instance):
        """
        ✅ Convert model instance to JSON-compatible dict.
        """
        data = super().to_representation(instance)
        logger.debug(
            "📤 Serializing user → Username: %s | ID: %s | Email: %s",
            instance.username, instance.id, instance.email
        )
        return data

    def create(self, validated_data):
        """
        ✅ Log new user creation attempt and pass to super.
        """
        username = validated_data.get("username", "<missing>")
        email = validated_data.get("email", "<missing>")
        logger.info("👤 Creating new user → Username: %s | Email: %s", username, email)

        try:
            instance = super().create(validated_data)
            logger.debug("✅ User created successfully: ID %s", instance.id)
            return instance
        except Exception as e:
            logger.error("❌ Error creating user: %s", str(e))
            raise

    def update(self, instance, validated_data):
        """
        ✅ Log user update attempt and pass to super.
        """
        logger.info("✏️ Updating user → Username: %s | ID: %s", instance.username, instance.id)
        try:
            instance = super().update(instance, validated_data)
            logger.debug("✅ User updated successfully: ID %s", instance.id)
            return instance
        except Exception as e:
            logger.error("❌ Error updating user %s: %s", instance.username, str(e))
            raise
