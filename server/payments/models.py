from django.db import models
from django.contrib.auth.models import User
from resources.models import Resource  # ✅ Ensure 'resources' app is in INSTALLED_APPS
import logging

logger = logging.getLogger(__name__)


class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.user.username}'s Wallet: Ksh {self.balance}"

    def save(self, *args, **kwargs):
        logger.debug("💼 Saving Wallet for user %s with balance Ksh %s", self.user.username, self.balance)
        super().save(*args, **kwargs)


class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    method = models.CharField(max_length=50)  # e.g., M-Pesa, Wallet
    status = models.CharField(max_length=20)  # Success, Pending, Failed
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.method} - Ksh {self.amount} [{self.status}]"

    def save(self, *args, **kwargs):
        logger.debug("💳 Transaction: %s paid Ksh %s via %s (%s)", self.user.username, self.amount, self.method, self.status)
        super().save(*args, **kwargs)


class PaidResource(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    paid_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} paid for '{self.resource.title}'"

    def save(self, *args, **kwargs):
        logger.debug("🔓 Marking '%s' as paid by user %s", self.resource.title, self.user.username)
        super().save(*args, **kwargs)
