// src/pages/Signup.js
import { register } from "../services/authService.js";

export function Signup() {
  const section = document.createElement("section");
  section.className =
    "min-h-screen bg-gray-100 flex items-center justify-center px-4";

  const wrapper = document.createElement("div");
  wrapper.className = "w-full max-w-md bg-white p-8 rounded shadow-md";

  wrapper.innerHTML = `
    <h2 class="text-2xl font-bold mb-6 text-center text-[#5624d0]">Create an Account</h2>
    <form class="space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
        <input id="name" type="text" placeholder="Your Name" required class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5624d0]" />
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input id="email" type="email" placeholder="example@email.com" required class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5624d0]" />
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <input id="password" type="password" placeholder="********" required class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5624d0]" />
      </div>
      <button type="submit" class="w-full bg-[#5624d0] text-white py-2 rounded hover:bg-purple-800 transition">
        Sign Up
      </button>
      <p class="text-sm text-center mt-4 text-gray-600">
        Already have an account?
        <a href="/login" class="text-[#5624d0] hover:underline">Login</a>
      </p>
    </form>
  `;

  // ✅ SPA link handler
  wrapper.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      console.log("🔗 SPA link clicked:", href);
      window.history.pushState({}, "", href);
      window.dispatchEvent(new Event("popstate"));
    });
  });

  // ✅ Handle form submission
  const form = wrapper.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = wrapper.querySelector("#name").value.trim();
    const email = wrapper.querySelector("#email").value.trim();
    const password = wrapper.querySelector("#password").value.trim();

    console.log("📝 Attempting registration with:", { name, email });

    try {
      const res = await register({ name, email, password });
      console.log("✅ Registration response:", res);

      alert("🎉 Registration successful. Please login.");
      window.history.pushState({}, "", "/login");
      window.dispatchEvent(new Event("popstate"));
    } catch (err) {
      console.error("❌ Registration error:", err.message);
      alert(`Error: ${err.message}`);
    }
  });

  section.appendChild(wrapper);
  return section;
}
