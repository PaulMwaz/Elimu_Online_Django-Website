from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register_user, name="register"),
    # you can add login or profile endpoints here later
]
