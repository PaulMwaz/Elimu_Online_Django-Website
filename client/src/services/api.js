// src/services/api.js

// 🌍 Dynamically set API Base URL based on environment
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000/api"
    : "https://elimu-online-backend.onrender.com/api"; // ✅ Update to your Render backend domain

console.log("🌍 API Base URL:", BASE_URL);

// ✅ Universal fetch wrapper with debug logs and error handling
async function fetchJSON(url, options = {}) {
  console.log("📡 Fetching:", url, options);

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // ✅ Ensure cookies/tokens are sent
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    console.error("❌ API Error:", error.message, response.status);
    throw new Error(error.message || "Request failed");
  }

  const data = await response.json();
  console.log("✅ API Success:", url, data);
  return data;
}

// ✅ User Registration
export async function registerUser(name, email, password) {
  console.log("📝 Registering user:", { name, email });

  return await fetchJSON(`${BASE_URL}/users/register/`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

// ✅ User Login
export async function loginUser(email, password) {
  console.log("🔐 Logging in:", email);

  return await fetchJSON(`${BASE_URL}/users/login/`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ✅ Fetch Public Resources
export async function fetchResources() {
  console.log("📥 Fetching resources...");
  return await fetchJSON(`${BASE_URL}/resources/`);
}

// ✅ Get File URL (from GCS or full URL)
export function getFileUrl(filePath) {
  const url = filePath.startsWith("http")
    ? filePath
    : `https://storage.googleapis.com/elimu-online-resources-2025/${filePath}`;
  console.log("🔗 File URL:", url);
  return url;
}

// ✅ Trigger Browser File Download
export function downloadFile(filePath) {
  const url = getFileUrl(filePath);
  console.log("⬇️ Downloading file:", url);

  const link = document.createElement("a");
  link.href = url;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ✅ Delete a Resource (Admin only)
export async function deleteResource(resourceId, token) {
  console.log("🗑️ Deleting resource:", resourceId);

  return await fetchJSON(`${BASE_URL}/resources/${resourceId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ✅ Upload New Resource (Admin only)
export async function uploadResource(formData, token) {
  console.log("📤 Uploading resource...");

  const response = await fetch(`${BASE_URL}/resources/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    console.error("❌ Upload Error:", error.message);
    throw new Error(error.message || "Upload failed");
  }

  const data = await response.json();
  console.log("✅ Upload successful:", data);
  return data;
}

// ✅ Check If User Paid for File
export async function checkIfPaid(fileId) {
  console.log("🔐 Checking payment for file ID:", fileId);

  const result = await fetchJSON(
    `${BASE_URL}/resources/${fileId}/is-paid-for`,
    {
      credentials: "include",
    }
  );

  return result.is_paid;
}

// ✅ M-Pesa Initiation
export async function initiateMpesa(phone, amount) {
  console.log("📲 Initiating M-Pesa:", { phone, amount });

  const res = await fetch(`${BASE_URL}/payment/initiate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone, amount }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({
      message: res.statusText,
    }));
    console.error("❌ M-Pesa Error:", error.message);
    throw new Error(error.message || "Payment failed");
  }

  const result = await res.json();
  console.log("✅ M-Pesa Initiated:", result);
  return result;
}
