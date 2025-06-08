import logging
from django import forms
from .models import Resource

logger = logging.getLogger(__name__)

class ResourceAdminForm(forms.ModelForm):
    class Meta:
        model = Resource
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        is_free = cleaned_data.get('is_free')
        price = cleaned_data.get('price')

        logger.debug("🧼 Cleaning form data → is_free: %s | price: %s", is_free, price)

        # ✅ Ensure free files have zero price
        if is_free and price and price > 0:
            logger.warning("❌ ValidationError: Free file has price > 0")
            raise forms.ValidationError("❌ Free files must have a price of 0.")

        # ✅ Ensure paid files have valid price
        if not is_free and (price is None or price == 0):
            logger.warning("❌ ValidationError: Paid file has no valid price")
            raise forms.ValidationError("❌ Paid files must have a price greater than 0.")

        logger.info("✅ ResourceAdminForm passed validation.")
        return cleaned_data
