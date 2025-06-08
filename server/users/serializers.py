import logging
from django.contrib.auth.models import User
from rest_framework import serializers

# ✅ Setup logger
logger = logging.getLogger(__name__)

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
        data = super().to_representation(instance)
        logger.debug(
            "📤 Serializing user → Username: %s | ID: %s | Email: %s",
            instance.username, instance.id, instance.email
        )
        return data

    def create(self, validated_data):
        username = validated_data.get("username")
        logger.info("👤 Creating new user → Username: %s", username)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        logger.info("✏️ Updating user → Username: %s", instance.username)
        return super().update(instance, validated_data)
