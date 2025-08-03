import logging
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

# ✅ Set up logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# ===============================
# ✅ Custom User Manager
# ===============================
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, full_name=None, **extra_fields):
        if not email:
            logger.error("❌ Attempted to create user without email.")
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        logger.info("✅ User created: %s", email)
        return user

    def create_superuser(self, email, password=None, full_name=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if not extra_fields.get("is_staff"):
            logger.error("❌ Superuser creation failed: is_staff not True")
            raise ValueError("Superuser must have is_staff=True.")
        if not extra_fields.get("is_superuser"):
            logger.error("❌ Superuser creation failed: is_superuser not True")
            raise ValueError("Superuser must have is_superuser=True.")

        logger.info("👑 Creating superuser: %s", email)
        return self.create_user(email, password, full_name, **extra_fields)

# ===============================
# ✅ Custom User Model
# ===============================
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'                 # ✅ Login via email
    REQUIRED_FIELDS = ['full_name']
    EMAIL_FIELD = 'email'                    # ✅ Used by JWT for authentication

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

# ===============================
# ✅ Profile Model
# ===============================
class Profile(models.Model):
    user = models.OneToOneField('users.CustomUser', on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.full_name}'s Profile"
