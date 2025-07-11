// src/pages/Login.js
import { login, saveAuthData } from "../services/authService.js";
import { router } from "../routes/router.js";
import { Navbar } from "../components/Navbar.js"; // ✅ Fix: Add this import

export function Login() {
  const section = document.createElement("section");
  section.className =
    "min-h-screen bg-gray-100 flex items-center justify-center px-4";

  const wrapper = document.createElement("div");
  wrapper.className = "w-full max-w-md bg-white p-8 rounded shadow-md";

  wrapper.innerHTML = `
    <h2 class="text-2xl font-bold mb-6 text-center text-[#5624d0]">Login to Your Account</h2>
    <form class="space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input id="email" type="email" placeholder="example@email.com" required class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5624d0]" />
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <input id="password" type="password" placeholder="********" required class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5624d0]" />
      </div>
      <button type="submit" class="w-full bg-[#5624d0] text-white py-2 rounded hover:bg-purple-800 transition">
        Login
      </button>
      <p class="text-sm text-center mt-4 text-gray-600">
        Don’t have an account?
        <a href="/signup" class="text-[#5624d0] hover:underline">Sign Up</a>
      </p>
    </form>
  `;

  // ✅ SPA Navigation
  wrapper.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      console.log("🔗 SPA navigation to:", href);
      window.history.pushState({}, "", href);
      window.dispatchEvent(new Event("popstate"));
    });
  });

  // ✅ Form Submission
  const form = wrapper.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = wrapper.querySelector("#email").value.trim();
    const password = wrapper.querySelector("#password").value.trim();

    console.log("🔐 Attempting login with:", { email, password });

    try {
      const response = await login(email, password);
      console.log("✅ Login success:", response);

      // ✅ Refresh Navbar with updated state
      const nav = document.querySelector("nav");
      if (nav) {
        nav.replaceWith(Navbar());
      } else {
        console.warn("⚠️ Navbar not found to refresh.");
      }

      alert("Login successful!");
      window.history.pushState({}, "", "/dashboard");
      window.dispatchEvent(new Event("popstate"));
    } catch (err) {
      console.error("❌ Login failed:", err.message);
      alert(`Error: ${err.message}`);
    }
  });

  section.appendChild(wrapper);
  return section;
}
