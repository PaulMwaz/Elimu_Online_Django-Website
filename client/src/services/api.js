const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000/api"
    : "https://elimu-backend-59739536402.europe-west1.run.app/api";

console.log("🌍 API Base URL:", BASE_URL);

// ✅ Universal JSON fetch helper with logs and error handling
async function fetchJSON(url, options = {}) {
  console.log("📡 Fetching:", url, options);

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    console.error("❌ API Error:", error.message, res.status);
    throw new Error(error.message || "Something went wrong");
  }

  const data = await res.json();
  console.log("✅ Fetched successfully:", url, data);
  return data;
}

// ✅ Registration API
export async function registerUser(name, email, password) {
  console.log("📝 Registering user with data:", { name, email, password });

  return await fetchJSON(`${BASE_URL}/users/register/`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

// ✅ Login API
export async function loginUser(email, password) {
  console.log("🔐 Logging in with credentials:", { email });

  return await fetchJSON(`${BASE_URL}/users/login/`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ✅ Fetch public resources
export async function fetchResources() {
  console.log("📥 fetchResources() called");
  return await fetchJSON(`${BASE_URL}/resources/`);
}

// ✅ Get GCS file URL
export function getFileUrl(filePath) {
  const url = filePath.startsWith("http")
    ? filePath
    : `https://storage.googleapis.com/elimu-online-resources-2025/${filePath}`;
  console.log("🔗 getFileUrl:", filePath, "=>", url);
  return url;
}

// ✅ Trigger browser download
export function downloadFile(filePath) {
  const url = getFileUrl(filePath);
  console.log("⬇️ Triggering download:", url);

  const link = document.createElement("a");
  link.href = url;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ✅ Delete a resource (Admin only)
export async function deleteResource(resourceId, token) {
  console.log("🗑️ Deleting resource:", resourceId);

  return await fetchJSON(`${BASE_URL}/resources/${resourceId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ✅ Upload resource file (Admin only)
export async function uploadResource(formData, token) {
  console.log("📤 Uploading resource via formData...");

  const res = await fetch(`${BASE_URL}/resources/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    console.error("❌ Upload failed:", error.message);
    throw new Error(error.message || "Upload failed");
  }

  const data = await res.json();
  console.log("✅ Upload successful:", data);
  return data;
}

// ✅ Check if a user has paid for a specific resource
export async function checkIfPaid(fileId) {
  console.log("🔐 Checking payment status for:", fileId);
  const result = await fetchJSON(
    `${BASE_URL}/resources/${fileId}/is-paid-for`,
    {
      credentials: "include",
    }
  );
  return result.is_paid;
}

// ✅ Initiate M-Pesa STK push to pay for a file
export async function initiateMpesa(phone, amount) {
  console.log("📲 Initiating M-Pesa payment:", { phone, amount });

  const res = await fetch(`${BASE_URL}/payment/initiate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone, amount }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    console.error("❌ M-Pesa initiation failed:", error.message);
    throw new Error(error.message || "M-Pesa failed");
  }

  const result = await res.json();
  console.log("✅ M-Pesa initiated:", result);
  return result;
}
