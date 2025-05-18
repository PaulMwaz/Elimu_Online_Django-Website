const API_BASE_URL = window.location.hostname.includes("localhost")
  ? "http://127.0.0.1:8000/api"
  : "https://elimu-backend-xyz.run.app/api";

/**
 * ✅ Get all uploaded resource files
 * Used by frontend to list both free and locked resources
 */
export async function fetchResources() {
  const response = await fetch(`${API_BASE_URL}/resources/`);
  if (!response.ok) {
    throw new Error("Failed to fetch resources");
  }
  return await response.json();
}

/**
 * ✅ Upload a new resource file (Admin use only)
 */
export async function uploadFile(formData, token) {
  const response = await fetch(`${API_BASE_URL}/resources/upload/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Upload failed");
  }

  return await response.json();
}

/**
 * ✅ Delete a resource file (Admin use only)
 */
export async function deleteFile(resourceId, token) {
  const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete resource");
  }
}

/**
 * ✅ Open a file in new tab using its signed GCS URL
 * This protects GCS bucket from being publicly crawled
 */
export function downloadFile(signedUrl) {
  if (!signedUrl) {
    alert("🔒 File is locked or preview not available");
    return;
  }
  window.open(signedUrl, "_blank");
}
