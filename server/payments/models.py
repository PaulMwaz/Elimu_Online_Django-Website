from django.db import models
from django.conf import settings
from resources.models import Resource
import logging
from decimal import Decimal
from django.core.validators import MinValueValidator

logger = logging.getLogger(__name__)


class Wallet(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wallet"
    )
    balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
    )

    def __str__(self):
        return f"{getattr(self.user, 'full_name', self.user)}'s Wallet: Ksh {self.balance}"

    def save(self, *args, **kwargs):
        logger.debug("💼 Saving Wallet → user: %s | balance: Ksh %.2f",
                     getattr(self.user, 'full_name', self.user), self.balance)
        super().save(*args, **kwargs)


class Transaction(models.Model):
    STATUS_CHOICES = (
        ("Pending", "Pending"),
        ("Success", "Success"),
        ("Failed", "Failed"),
    )

    METHOD_CHOICES = (
        ("M-Pesa", "M-Pesa"),
        ("Wallet", "Wallet"),
        ("Card", "Card"),
        ("Bank", "Bank"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions"
    )
    amount = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    method = models.CharField(max_length=50, choices=METHOD_CHOICES, default="M-Pesa")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["user", "created_at"])]

    def __str__(self):
        return f"{getattr(self.user, 'full_name', self.user)} - {self.method} - Ksh {self.amount} [{self.status}]"

    def save(self, *args, **kwargs):
        logger.debug("💳 Transaction → user: %s | method: %s | amount: Ksh %.2f | status: %s",
                     getattr(self.user, 'full_name', self.user), self.method, self.amount, self.status)
        super().save(*args, **kwargs)


class PaidResource(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="paid_resources"
    )
    resource = models.ForeignKey(
        Resource,
        on_delete=models.CASCADE,
        related_name="purchasers"
    )
    paid_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "resource")
        indexes = [models.Index(fields=["user", "resource"])]

    def __str__(self):
        return f"{getattr(self.user, 'full_name', self.user)} paid for '{self.resource.title}'"

    def save(self, *args, **kwargs):
        logger.debug("🔓 PaidResource → user: %s | resource: %s",
                     getattr(self.user, 'full_name', self.user), self.resource.title)
        super().save(*args, **kwargs)
