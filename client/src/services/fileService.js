const API_BASE_URL = window.location.hostname.includes("localhost")
  ? "http://127.0.0.1:8000/api"
  : "https://elimu-backend-xyz.run.app/api";

console.log("🌐 API_BASE_URL set to:", API_BASE_URL);

/**
 * ✅ Get all uploaded resource files (for users)
 */
export async function fetchResources() {
  console.log("📥 Fetching resource list...");

  try {
    const response = await fetch(`${API_BASE_URL}/resources/`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Failed to fetch resources:", errorText);
      throw new Error("Failed to fetch resources");
    }

    const data = await response.json();
    console.log("✅ Resources fetched successfully:", data);
    return data;
  } catch (err) {
    console.error("🔥 fetchResources() error:", err);
    throw err;
  }
}

/**
 * ✅ Upload a new file (Admin only)
 */
export async function uploadFile(formData, token) {
  console.log("📤 Uploading file...");

  try {
    const response = await fetch(`${API_BASE_URL}/resources/upload/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Upload failed:", error);
      throw new Error(error.message || "Upload failed");
    }

    const result = await response.json();
    console.log("✅ Upload successful:", result);
    return result;
  } catch (err) {
    console.error("🔥 uploadFile() error:", err);
    throw err;
  }
}

/**
 * ✅ Delete a file (Admin only)
 */
export async function deleteFile(resourceId, token) {
  console.log(`🗑️ Deleting resource with ID: ${resourceId}`);

  try {
    const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Failed to delete resource:", errorText);
      throw new Error("Failed to delete resource");
    }

    console.log("✅ Resource deleted successfully.");
  } catch (err) {
    console.error("🔥 deleteFile() error:", err);
    throw err;
  }
}

/**
 * ✅ Open a file in a new tab using a signed GCS URL
 */
export function downloadFile(signedUrl) {
  console.log("📂 Download request initiated...");

  if (!signedUrl) {
    console.warn("🔒 File is locked or preview not available");
    alert("🔒 File is locked or preview not available");
    return;
  }

  console.log("✅ Opening signed file URL:", signedUrl);
  window.open(signedUrl, "_blank");
}
