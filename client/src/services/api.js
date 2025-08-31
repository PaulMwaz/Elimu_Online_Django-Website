// src/services/api.js
// =============================================================
// Centralized API client for Elimu-Online
// - Reads API base from Vite env: VITE_API_URL  (e.g. http://127.0.0.1:8000/api)
// - Detailed debug logs (grouped)
// - Normalizes resource objects for the UI
// - Friendly error messages with status + response body
// - No cookies by default; pass JWT via Authorization header when needed
// =============================================================

/* ----------------------------- Config & helpers ---------------------------- */

const ENV_BASE =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : window?.location?.hostname === "localhost" ||
      window?.location?.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000/api"
    : "/api";

const API_BASE_URL = String(ENV_BASE).replace(/\/+$/, "");
window.__API_BASE_URL__ = API_BASE_URL; // quick sanity check in DevTools

function logGroup(title, obj) {
  try {
    console.groupCollapsed(title);
    if (obj !== undefined) console.log(obj);
    console.groupEnd();
  } catch (_) {}
}

function joinUrl(...parts) {
  return (
    parts
      .filter(Boolean)
      .map((p, i) =>
        i === 0 ? p.replace(/\/+$/g, "") : p.replace(/^\/+|\/+$/g, "")
      )
      .join("/") + "/"
  );
}

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

async function fetchJSON(
  url,
  { method = "GET", headers = {}, body, ...rest } = {}
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

/* ------------------------------ Normalization ----------------------------- */

function normalizeResource(r) {
  // Prefer API-provided links; otherwise fallback to bucket path builder
  const fileUrl = r.file_url || r.file || null;
  const previewUrl = r.preview_url || r.file_url || fileUrl || null;
  const downloadUrl = r.signed_url || r.file_url || fileUrl || null;

  return {
    id: r.id,
    title: r.title,
    category: r.category_display || r.category,
    level: r.level_display || r.level,
    term: r.term_display || r.term,
    isFree: r.is_free,
    price: r.price,
    createdAt: r.created_at,
    previewUrl,
    downloadUrl,
    _raw: r,
  };
}

/* ------------------------------- Public API -------------------------------- */

export const __API_BASE_URL__ = API_BASE_URL;

// Users
export async function registerUser(username, email, password) {
  const url = joinUrl(API_BASE_URL, "users", "register");
  const payload = { username, email, password };
  logGroup("📝 registerUser()", { url, payload });
  return fetchJSON(url, { method: "POST", body: JSON.stringify(payload) });
}

export async function loginUser(email, password) {
  // Backend route is /api/users/auth/login/
  const url = joinUrl(API_BASE_URL, "users", "auth", "login");
  const payload = { email, password };
  logGroup("🔐 loginUser()", { url, payload });
  return fetchJSON(url, { method: "POST", body: JSON.stringify(payload) });
}

// Resources
export async function fetchResources() {
  const url = joinUrl(API_BASE_URL, "resources");
  logGroup("📥 fetchResources() → request", { url });

  const raw = await fetchJSON(url);

  // Accept [] | {results: []} | {data: []}
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.results)
    ? raw.results
    : Array.isArray(raw?.data)
    ? raw.data
    : [];

  logGroup("📦 fetchResources() → list (raw)", list);
  const normalized = list.map(normalizeResource);
  logGroup("✅ fetchResources() → normalized", normalized);
  return normalized;
}

// Files
export function getFileUrl(filePath) {
  const url = filePath?.startsWith?.("http")
    ? filePath
    : `https://storage.googleapis.com/elimu-online-resources-2025/${String(
        filePath || ""
      ).replace(/^\/+/, "")}`;
  logGroup("🔗 getFileUrl()", { input: filePath, resolved: url });
  return url;
}

export function downloadFile(filePathOrUrl) {
  const url = getFileUrl(filePathOrUrl);
  logGroup("⬇️ downloadFile()", { url });
  const a = document.createElement("a");
  a.href = url;
  a.download = "";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Payments (optional)
export async function checkIfPaid(resourceId) {
  const url = joinUrl(
    API_BASE_URL,
    "payment",
    String(resourceId),
    "is-paid-for"
  );
  logGroup("🔐 checkIfPaid()", { url, resourceId });
  const r = await fetchJSON(url);
  return !!r?.is_paid;
}

export async function initiateMpesa(phone, amount) {
  const url = joinUrl(API_BASE_URL, "payment", "initiate");
  const payload = { phone, amount };
  logGroup("📲 initiateMpesa()", { url, payload });
  return fetchJSON(url, { method: "POST", body: JSON.stringify(payload) });
}

export default {
  __API_BASE_URL__,
  registerUser,
  loginUser,
  fetchResources,
  getFileUrl,
  downloadFile,
  checkIfPaid,
  initiateMpesa,
};
