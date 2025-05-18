from django import forms
from .models import Resource

class ResourceAdminForm(forms.ModelForm):
    class Meta:
        model = Resource
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        is_free = cleaned_data.get('is_free')
        price = cleaned_data.get('price')

        # ✅ Ensure free files have zero price
        if is_free and price and price > 0:
            raise forms.ValidationError("❌ Free files must have a price of 0.")

        # ✅ Ensure paid files have a valid price > 0
        if not is_free and (price is None or price == 0):
            raise forms.ValidationError("❌ Paid files must have a price greater than 0.")

        return cleaned_data
