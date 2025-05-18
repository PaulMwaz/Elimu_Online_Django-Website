from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Resource
from .serializers import ResourceSerializer

# ✅ Public view for listing all resources
class ResourceListView(generics.ListAPIView):
    queryset = Resource.objects.all().order_by('-uploaded_at')
    serializer_class = ResourceSerializer
    permission_classes = [permissions.AllowAny]


# ✅ Admin-only view to upload new resource files
class ResourceUploadView(generics.CreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        instance = serializer.save()

        # ✅ Sanitize filename: remove spaces for GCS compatibility
        if instance.file and " " in instance.file.name:
            instance.file.name = instance.file.name.replace(" ", "_")
            instance.save()
