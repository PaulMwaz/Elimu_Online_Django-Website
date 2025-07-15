// src/services/api.js

// 🌍 Dynamically set API Base URL based on environment
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000/api"
    : "https://elimu-backend-59739536402.europe-west1.run.app/api"; // ✅ Updated to your Google Cloud backend

console.log("🌍 API Base URL:", BASE_URL);

// ✅ Universal fetch wrapper with debug logs and error handling
async function fetchJSON(url, options = {}) {
  console.log("📡 [fetchJSON] Requesting:", url);
  console.log("📨 [fetchJSON] Options:", options);

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // ✅ Send cookies/tokens
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    console.error("❌ [fetchJSON] API Error:", response.status, error.message);
    throw new Error(error.message || "Request failed");
  }

  const data = await response.json();
  console.log("✅ [fetchJSON] Response OK:", data);
  return data;
}

// ✅ User Registration
export async function registerUser(name, email, password) {
  console.log("📝 [registerUser] Registering:", { name, email });

  return await fetchJSON(`${BASE_URL}/users/register/`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

// ✅ User Login
export async function loginUser(email, password) {
  console.log("🔐 [loginUser] Logging in:", email);

  return await fetchJSON(`${BASE_URL}/users/login/`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ✅ Fetch Public Resources
export async function fetchResources() {
  console.log("📥 [fetchResources] Fetching resources...");
  return await fetchJSON(`${BASE_URL}/resources/`);
}

// ✅ Get Full File URL
export function getFileUrl(filePath) {
  const url = filePath.startsWith("http")
    ? filePath
    : `https://storage.googleapis.com/elimu-online-resources-2025/${filePath}`;
  console.log("🔗 [getFileUrl] Resolved URL:", url);
  return url;
}

// ✅ Trigger File Download
export function downloadFile(filePath) {
  const url = getFileUrl(filePath);
  console.log("⬇️ [downloadFile] Starting download:", url);

  const link = document.createElement("a");
  link.href = url;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ✅ Delete Resource (Admin)
export async function deleteResource(resourceId, token) {
  console.log("🗑️ [deleteResource] Deleting:", resourceId);

  return await fetchJSON(`${BASE_URL}/resources/${resourceId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ✅ Upload Resource (Admin)
export async function uploadResource(formData, token) {
  console.log("📤 [uploadResource] Uploading new file...");

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
    console.error("❌ [uploadResource] Upload error:", error.message);
    throw new Error(error.message || "Upload failed");
  }

  const data = await response.json();
  console.log("✅ [uploadResource] Upload successful:", data);
  return data;
}

// ✅ Check Payment Status for File
export async function checkIfPaid(fileId) {
  console.log("🔐 [checkIfPaid] Checking payment for:", fileId);

  const result = await fetchJSON(
    `${BASE_URL}/resources/${fileId}/is-paid-for`,
    {
      credentials: "include",
    }
  );

  return result.is_paid;
}

// ✅ Initiate M-Pesa Payment
export async function initiateMpesa(phone, amount) {
  console.log("📲 [initiateMpesa] Initiating:", { phone, amount });

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
    console.error("❌ [initiateMpesa] Failed:", error.message);
    throw new Error(error.message || "Payment failed");
  }

  const result = await res.json();
  console.log("✅ [initiateMpesa] Success:", result);
  return result;
}
