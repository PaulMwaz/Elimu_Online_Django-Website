import os
import base64
import logging
from datetime import datetime
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

# ✅ Load from settings (from .env via settings.py)
BASE_URL = "https://sandbox.safaricom.co.ke" if settings.MPESA_ENV == "sandbox" else "https://api.safaricom.co.ke"

CONSUMER_KEY = settings.MPESA_CONSUMER_KEY
CONSUMER_SECRET = settings.MPESA_CONSUMER_SECRET
SHORTCODE = settings.MPESA_SHORTCODE
PASSKEY = settings.MPESA_PASSKEY
CALLBACK_URL = settings.MPESA_CALLBACK_URL


def generate_token():
    """🔐 Get OAuth access token from Safaricom"""
    token_url = f"{BASE_URL}/oauth/v1/generate?grant_type=client_credentials"
    logger.debug("🔐 Requesting M-Pesa token from: %s", token_url)

    try:
        response = requests.get(token_url, auth=(CONSUMER_KEY, CONSUMER_SECRET))
        response.raise_for_status()
        token = response.json().get("access_token")
        logger.debug("✅ M-Pesa token received: %s", token)
        return token

    except requests.RequestException as e:
        logger.error("❌ Failed to obtain M-Pesa token: %s", str(e))
        return None


def lipa_na_mpesa(phone, amount, token=None, title="Elimu Resource"):
    """📲 Initiates M-Pesa STK Push"""
    logger.info("📲 Initiating STK push → Phone: %s | Amount: %s", phone, amount)

    token = token or generate_token()
    if not token:
        logger.error("❌ Aborting: No valid token generated.")
        return {"error": "TokenError", "details": "Could not generate access token"}

    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode(f"{SHORTCODE}{PASSKEY}{timestamp}".encode()).decode()

    payload = {
        "BusinessShortCode": SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": SHORTCODE,
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
