const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000/api"
    : "https://elimu-backend-59739536402.europe-west1.run.app/api";

// ✅ Save tokens to localStorage
export function saveAuthData(accessToken, refreshToken = null) {
  console.log("🔐 Saving tokens to localStorage...");
  localStorage.setItem("auth_token", accessToken);
  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }
}

// ✅ Get access token
export function getToken() {
  const token = localStorage.getItem("auth_token");
  console.log("🔎 Fetched access token:", token ? "✔️ Found" : "❌ Missing");
  return token;
}

// ✅ Get refresh token
export function getRefreshToken() {
  const token = localStorage.getItem("refresh_token");
  console.log("🔎 Fetched refresh token:", token ? "✔️ Found" : "❌ Missing");
  return token;
}

// ✅ Check if user is logged in
export function isLoggedIn() {
  const loggedIn = !!getToken();
  console.log("👁️ Logged in:", loggedIn);
  return loggedIn;
}

// ✅ Logout and clear all auth info
export function logout() {
  console.log("🚪 Logging out: clearing localStorage tokens & user...");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("auth_user");
}

// ✅ Get Authorization headers
export function getAuthHeaders() {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  console.log("📦 Auth headers generated:", headers);
  return headers;
}

// ✅ Login user via JWT
export async function login(email, password) {
  console.log("🚀 Attempting login with:", email);
  const res = await fetch(`${BASE_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Login failed" }));
    console.error("❌ Login failed:", err);
    throw new Error(err.detail || err.message || "Invalid credentials");
  }

  const data = await res.json();
  console.log("✅ JWT tokens received:", data);
  saveAuthData(data.access, data.refresh);

  const user = await fetchProfile(data.access);
  localStorage.setItem("auth_user", JSON.stringify(user));
  console.log("👤 Logged-in user profile:", user);

  return { token: data.access, user };
}

// ✅ Fetch user profile (protected endpoint)
async function fetchProfile(token) {
  console.log("📡 Fetching user profile with token...");
  const res = await fetch(`${BASE_URL}/users/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    console.warn("⚠️ Failed to fetch profile. Using fallback.");
    return { name: "User", email: "unknown" };
  }

  return await res.json();
}

// ✅ Return current user from localStorage
export function getCurrentUser() {
  const user = localStorage.getItem("auth_user");
  console.log("🧾 Current user from localStorage:", user);
  return user ? JSON.parse(user) : null;
}

// ✅ Register new user
export async function register(userData) {
  console.log("📝 Registering user with data:", userData);
  const res = await fetch(`${BASE_URL}/users/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ message: "Registration failed" }));
    console.error("❌ Registration error:", err);
    throw new Error(err.message || "Signup error");
  }

  const response = await res.json();
  console.log("✅ Registration successful:", response);
  return response;
}
