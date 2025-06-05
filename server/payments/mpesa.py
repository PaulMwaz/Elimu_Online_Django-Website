# mpesa.py

import requests
import base64
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# ✅ Use ngrok public URL while testing with sandbox
CALLBACK_URL = "https://773c-41-139-193-51.ngrok-free.app/api/payment/confirmation/"

# ✅ Base URL for sandbox; swap to production if needed later
BASE_URL = "https://sandbox.safaricom.co.ke"


def generate_token(consumer_key, consumer_secret):
    """🔐 Get OAuth access token from Safaricom"""
    token_url = f"{BASE_URL}/oauth/v1/generate?grant_type=client_credentials"
    logger.debug("🔐 Requesting M-Pesa token from: %s", token_url)

    try:
        response = requests.get(token_url, auth=(consumer_key, consumer_secret))
        response.raise_for_status()
        token = response.json().get("access_token")
        logger.debug("✅ M-Pesa token received: %s", token)
        return token

    except requests.RequestException as e:
        logger.error("❌ Failed to obtain M-Pesa token: %s", str(e))
        return None


def lipa_na_mpesa(phone, amount, token, shortcode, passkey, title="Elimu Resource"):
    """📲 Initiates M-Pesa STK Push"""
    logger.info("📲 Initiating STK push → Phone: %s | Amount: %s", phone, amount)

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
        "CallBackURL": CALLBACK_URL,
        "AccountReference": "ElimuOnline",
        "TransactionDesc": f"Unlock {title}"
    }

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    logger.debug("📦 Payload: %s", payload)
    logger.debug("🔗 Sending STK push to: %s/mpesa/stkpush/v1/processrequest", BASE_URL)

    try:
        response = requests.post(
            f"{BASE_URL}/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers=headers,
            timeout=15
        )
        response.raise_for_status()
        result = response.json()
        logger.info("✅ STK Push response: %s", result)
        return result

    except requests.HTTPError as http_err:
        logger.error("❌ HTTP error during STK push: %s", str(http_err))
        return {"error": "HTTPError", "details": str(http_err)}

    except requests.RequestException as req_err:
        logger.error("❌ Request error: %s", str(req_err))
        return {"error": "RequestError", "details": str(req_err)}

    except Exception as e:
        logger.exception("❌ Unexpected error during STK push: %s", str(e))
        return {"error": "UnexpectedError", "details": str(e)}
