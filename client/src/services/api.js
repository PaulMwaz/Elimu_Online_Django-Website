const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000/api"
    : "https://elimu-backend-59739536402.europe-west1.run.app/api";

// ✅ Helper: handle JSON fetch
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "Something went wrong");
  }

  return await res.json();
}

// ✅ Fetch all resources
export async function getAllResources() {
  return await fetchJSON(`${BASE_URL}/resources/`);
}

// ✅ View or preview a file (open URL in browser)
export function getFileUrl(filePath) {
  return filePath.startsWith("http")
    ? filePath
    : `https://storage.googleapis.com/elimu-online-resources-2025/${filePath}`;
}

// ✅ Download a file (trigger browser download)
export function downloadFile(filePath) {
  const url = getFileUrl(filePath);
  const link = document.createElement("a");
  link.href = url;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ✅ Delete file (admin only)
export async function deleteResource(resourceId, token) {
  return await fetchJSON(`${BASE_URL}/resources/${resourceId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ✅ Upload file (admin only, optional)
export async function uploadResource(formData, token) {
  const res = await fetch(`${BASE_URL}/resources/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "Upload failed");
  }

  return await res.json();
}
