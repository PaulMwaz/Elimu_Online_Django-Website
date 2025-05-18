from django.urls import path
from .views import get_wallet, top_up_wallet

urlpatterns = [
    path('wallet/', get_wallet),
    path('top-up/', top_up_wallet),
]
