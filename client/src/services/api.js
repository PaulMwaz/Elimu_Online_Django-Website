// src/services/api.js
// =============================================================
// Centralized API client for Elimu-Online (Render ↔ Render)
// - Reads API base from Vite env: VITE_API_URL
// - Detailed debug logs (grouped)
// - Normalized URLs (avoids double slashes)
// - Friendly error messages with status + response body
// - No cookies by default (JWT goes in Authorization header)
// =============================================================

// ---------- Config & Helpers --------------------------------

// Prefer build-time env var; fallback to /api for one-origin reverse proxy.
// In local dev (no proxy), fall back to Django on 8000.
const ENV_BASE =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : window?.location?.hostname === "localhost" ||
      window?.location?.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000/api"
    : "/api"; // final fallback for production behind a reverse proxy

// Normalize: remove trailing slash to control joining later.
const API_BASE_URL = String(ENV_BASE).replace(/\/+$/, "");

// Optional: quick sanity check in DevTools
window.__API_BASE_URL__ = API_BASE_URL;

// Pretty logger
function logGroup(title, obj) {
  try {
    console.groupCollapsed(title);
    if (obj !== undefined) console.log(obj);
    console.groupEnd();
  } catch (_) {}
}

// Create a full URL ensuring exactly one slash between parts.
function joinUrl(...parts) {
  return (
    parts
      .filter(Boolean)
      .map((p, i) =>
        i === 0 ? p.replace(/\/+$/g, "") : p.replace(/^\/+|\/+$/g, "")
      )
      .join("/") + "/"
  ); // always end endpoints with a trailing slash
}

// Build a readable error from a fetch Response
async function buildError(res) {
  let bodyText = "";
  try {
    bodyText = await res.clone().text();
  } catch (_) {}

  let message = res.statusText || "Request failed";
  try {
    const json = JSON.parse(bodyText);
    message = json.message || json.detail || JSON.stringify(json);
  } catch (_) {
    if (bodyText) message = `${message} — ${bodyText.substring(0, 300)}`;
  }
  const err = new Error(`HTTP ${res.status}: ${message}`);
  err.status = res.status;
  err.body = bodyText;
  return err;
}

// Generic JSON fetcher (no cookies unless you explicitly pass credentials)
async function fetchJSON(
  url,
  { method = "GET", headers = {}, body = undefined, ...rest } = {}
) {
  logGroup("📡 fetchJSON → Request", { url, method, headers, body, rest });

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body,
    ...rest,
  });

  const debug = {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    url: res.url,
    headers: Object.fromEntries(res.headers.entries()),
  };
  logGroup("📬 fetchJSON ← Response", debug);

  if (!res.ok) {
    const err = await buildError(res);
    console.error("❌ fetchJSON Error:", err);
    throw err;
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  logGroup("✅ fetchJSON Parsed JSON", data);
  return data;
}

// ---------- Public API --------------------------------------

// 🧭 Expose the resolved base for sanity checks in the console
export const __API_BASE_URL__ = API_BASE_URL;

// 📝 Register user (username + email + password)
export async function registerUser(username, email, password) {
  const url = joinUrl(API_BASE_URL, "users", "register");
  const payload = { username, email, password };
  logGroup("📝 registerUser()", { url, payload });
  return fetchJSON(url, { method: "POST", body: JSON.stringify(payload) });
}

// 🔐 Login with email + password (returns JWT if your API issues it)
export async function loginUser(email, password) {
  const url = joinUrl(API_BASE_URL, "users", "login");
  const payload = { email, password };
  logGroup("🔐 loginUser()", { url, payload });
  return fetchJSON(url, { method: "POST", body: JSON.stringify(payload) });
}

// 📚 Fetch public resources
export async function fetchResources() {
  const url = joinUrl(API_BASE_URL, "resources");
  logGroup("📥 fetchResources()", { url });
  return fetchJSON(url);
}

// 🔗 Build a public file URL (GCS bucket)
export function getFileUrl(filePath) {
  const url = filePath?.startsWith("http")
    ? filePath
    : `https://storage.googleapis.com/elimu-online-resources-2025/${String(
        filePath || ""
      ).replace(/^\/+/, "")}`;
  logGroup("🔗 getFileUrl()", { input: filePath, resolved: url });
  return url;
}

// ⬇️ Trigger browser download
export function downloadFile(filePath) {
  const url = getFileUrl(filePath);
  logGroup("⬇️ downloadFile()", { url });
  const a = document.createElement("a");
  a.href = url;
  a.download = "";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// 🗑️ Delete resource (admin, JWT required)
export async function deleteResource(resourceId, token) {
  const url = joinUrl(API_BASE_URL, "resources", String(resourceId));
  logGroup("🗑️ deleteResource()", { url, resourceId });
  return fetchJSON(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// 📤 Upload resource (admin, JWT required)
export async function uploadResource(formData, token) {
  const url = joinUrl(API_BASE_URL, "resources");
  logGroup("📤 uploadResource()", { url, formDataKeys: [...formData.keys()] });

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }, // no Content-Type for FormData
    body: formData,
  });

  const debug = {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    url: res.url,
    headers: Object.fromEntries(res.headers.entries()),
  };
  logGroup("📬 uploadResource ← Response", debug);

  if (!res.ok) {
    const err = await buildError(res);
    console.error("❌ uploadResource Error:", err);
    throw err;
  }
  const data = await res.json().catch(() => null);
  logGroup("✅ uploadResource Parsed JSON", data);
  return data;
}

// 🔎 Check if file is paid for (by current user)
export async function checkIfPaid(fileId) {
  const url = joinUrl(API_BASE_URL, "resources", String(fileId), "is-paid-for");
  logGroup("🔐 checkIfPaid()", { url, fileId });
  const r = await fetchJSON(url);
  return !!r?.is_paid;
}

// 📲 Initiate M‑Pesa payment
export async function initiateMpesa(phone, amount) {
  const url = joinUrl(API_BASE_URL, "payment", "initiate");
  const payload = { phone, amount };
  logGroup("📲 initiateMpesa()", { url, payload });
  return fetchJSON(url, { method: "POST", body: JSON.stringify(payload) });
}

// ---------- Default export (optional convenience) -----------
export default {
  __API_BASE_URL__,
  registerUser,
  loginUser,
  fetchResources,
  getFileUrl,
  downloadFile,
  deleteResource,
  uploadResource,
  checkIfPaid,
  initiateMpesa,
};
