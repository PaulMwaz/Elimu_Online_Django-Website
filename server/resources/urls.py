from django.urls import path
from .views import ResourceListView, ResourceUploadView

urlpatterns = [
    # ✅ Public: List all uploaded resources (e.g., for frontend file display)
    path('', ResourceListView.as_view(), name='resource-list'),

    # ✅ Admin-only: Upload new resource files
    path('upload/', ResourceUploadView.as_view(), name='resource-upload'),
]
