import os
import base64
import logging
from datetime import datetime
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

# ✅ Load M-Pesa credentials from environment/config
BASE_URL = "https://sandbox.safaricom.co.ke" if settings.MPESA_ENV == "sandbox" else "https://api.safaricom.co.ke"

CONSUMER_KEY = settings.MPESA_CONSUMER_KEY
CONSUMER_SECRET = settings.MPESA_CONSUMER_SECRET
SHORTCODE = settings.MPESA_SHORTCODE
PASSKEY = settings.MPESA_PASSKEY
CALLBACK_URL = settings.MPESA_CALLBACK_URL


def generate_token():
    """🔐 Request OAuth access token from Safaricom"""
    token_url = f"{BASE_URL}/oauth/v1/generate?grant_type=client_credentials"
    logger.debug("🔐 Generating M-Pesa token from %s", token_url)

    try:
        response = requests.get(token_url, auth=(CONSUMER_KEY, CONSUMER_SECRET), timeout=10)
        response.raise_for_status()
        token = response.json().get("access_token")
        if token:
            logger.info("✅ M-Pesa token generated successfully")
        else:
            logger.warning("⚠️ Token not found in response JSON: %s", response.json())
        return token
    except requests.RequestException as e:
        logger.error("❌ Failed to get M-Pesa token: %s", str(e))
        return None


def lipa_na_mpesa(phone, amount, token=None, title="Elimu Resource"):
    """📲 Initiate M-Pesa STK Push"""
    logger.info("📲 STK Push: Phone=%s | Amount=Ksh %s", phone, amount)

    token = token or generate_token()
    if not token:
        return {"error": "TokenError", "details": "Failed to generate M-Pesa token"}

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

    logger.debug("📦 M-Pesa STK Payload: %s", payload)

    try:
        response = requests.post(
            f"{BASE_URL}/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers=headers,
            timeout=15
        )
        response.raise_for_status()
        result = response.json()
        logger.info("✅ STK Push Success: %s", result)
        return result

    except requests.HTTPError as http_err:
        logger.error("❌ HTTPError: %s", str(http_err))
        return {"error": "HTTPError", "details": str(http_err)}

    except requests.RequestException as req_err:
        logger.error("❌ RequestException: %s", str(req_err))
        return {"error": "RequestError", "details": str(req_err)}

    except Exception as e:
        logger.exception("❌ UnexpectedError during STK push")
        return {"error": "UnexpectedError", "details": str(e)}
