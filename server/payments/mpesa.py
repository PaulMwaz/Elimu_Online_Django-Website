import requests
import base64
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

def generate_token(consumer_key, consumer_secret):
    """✅ Get OAuth access token from Safaricom API"""
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    logger.debug("🔐 Requesting M-Pesa token from: %s", url)

    try:
        response = requests.get(url, auth=(consumer_key, consumer_secret))
        response.raise_for_status()
        token = response.json().get('access_token')
        logger.debug("✅ Token received: %s", token)
        return token

    except requests.RequestException as e:
        logger.error("❌ Failed to get M-Pesa token: %s", str(e))
        return None


def lipa_na_mpesa(phone, amount, callback_url, token, shortcode, passkey):
    """✅ Initiates an STK push request"""
    logger.info("📲 Initiating M-Pesa STK push...")
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode(f"{shortcode}{passkey}{timestamp}".encode()).decode()

    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": shortcode,
        "PhoneNumber": phone,
        "CallBackURL": callback_url,
        "AccountReference": "ElimuOnline",
        "TransactionDesc": "File Purchase"
    }

    headers = {"Authorization": f"Bearer {token}"}

    logger.debug("📦 Payload: %s", payload)
    logger.debug("🔗 Endpoint: https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest")

    try:
        response = requests.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers=headers,
            timeout=15
        )
        response.raise_for_status()
        result = response.json()
        logger.info("✅ STK Push request successful: %s", result)
        return result

    except requests.RequestException as e:
        logger.error("❌ STK Push request failed: %s", str(e))
        return {"error": "STK push failed", "details": str(e)}
