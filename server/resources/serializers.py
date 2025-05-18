from rest_framework import serializers
from .models import Resource

class ResourceSerializer(serializers.ModelSerializer):
    # ✅ Include both public file URL (if any) and signed GCS URL
    file_url = serializers.SerializerMethodField()
    signed_url = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = '__all__'  # You can switch to a manual list for finer control
        read_only_fields = ('uploaded_at',)

    def get_file_url(self, obj):
        """
        Returns the public file URL (for testing or public buckets).
        This is mostly for fallback purposes.
        """
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url if obj.file else None

    def get_signed_url(self, obj):
        """
        Returns a signed, time-limited GCS URL for secure preview/download.
        """
        try:
            return obj.get_signed_url()
        except Exception:
            return None
