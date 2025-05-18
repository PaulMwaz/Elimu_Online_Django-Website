import { getCurrentUser, isLoggedIn, logout } from "../services/authService.js";
import { router } from "../routes/router.js";

export function Navbar() {
  const user = getCurrentUser();
  console.log("👤 Current User in Navbar:", user);

  const nav = document.createElement("nav");
  nav.className =
    "bg-white/90 backdrop-blur shadow-md fixed w-full top-0 z-50 px-6 py-4 flex items-center justify-between";

  nav.innerHTML = `
    <div class="flex items-center gap-2">
      <img src="/logo.png" alt="Logo" class="h-8 w-8 rounded-full bg-white border" />
      <span class="text-xl font-bold text-[#5624d0]">Elimu_Online</span>
    </div>

    <!-- Desktop Links -->
    <div class="hidden md:flex gap-6 text-sm font-medium text-gray-700">
      <a href="/" class="hover:text-[#5624d0]">Home</a>
      <a href="/about" class="hover:text-[#5624d0]">About Us</a>
      <a href="/resources" class="hover:text-[#5624d0]">Resources</a>
    </div>

    <!-- Desktop Auth -->
    <div id="auth-section" class="hidden md:flex gap-3 text-sm font-medium">
      ${isLoggedIn() ? renderProfileDropdown(user) : renderAuthLinks()}
    </div>

    <!-- Mobile menu toggle -->
    <button id="menuToggle" class="md:hidden text-[#5624d0] text-2xl focus:outline-none transition duration-200">
      <span id="menuIcon">☰</span>
    </button>

    <!-- Mobile Menu -->
    <div id="mobileMenu" class="hidden absolute top-full left-0 w-full bg-white shadow-md z-40 py-4 px-6 flex flex-col gap-4 text-sm">
      <a href="/" class="hover:text-[#5624d0]">Home</a>
      <a href="/about" class="hover:text-[#5624d0]">About Us</a>
      <a href="/resources" class="hover:text-[#5624d0]">Resources</a>
      <div id="mobile-auth-links">
        ${isLoggedIn() ? renderMobileProfile(user) : renderMobileAuth()}
      </div>
    </div>
  `;

  // ✅ SPA link handling
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", handleNavClick);
  });

  // ✅ Toggle mobile menu
  const menuToggle = nav.querySelector("#menuToggle");
  const menuIcon = nav.querySelector("#menuIcon");
  const mobileMenu = nav.querySelector("#mobileMenu");

  menuToggle.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    console.log("📱 Menu toggle clicked. Open:", !isOpen);
    mobileMenu.classList.toggle("hidden");
    menuIcon.textContent = isOpen ? "☰" : "✖";
  });

  // ✅ Logout (desktop + mobile)
  const logoutBtn = nav.querySelector("#logoutBtn");
  const logoutBtnMobile = nav.querySelector("#logoutBtnMobile");

  [logoutBtn, logoutBtnMobile].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => {
        console.log("🚪 Logging out user...");
        logout();

        // 🔄 Refresh both auth sections
        const authDiv = nav.querySelector("#auth-section");
        const mobileAuthDiv = nav.querySelector("#mobile-auth-links");
        if (authDiv) {
          authDiv.innerHTML = renderAuthLinks();
          addLinkListeners(authDiv);
        }
        if (mobileAuthDiv) {
          mobileAuthDiv.innerHTML = renderMobileAuth();
          addLinkListeners(mobileAuthDiv);
        }

        // Close mobile menu and redirect
        mobileMenu.classList.add("hidden");
        menuIcon.textContent = "☰";
        window.history.pushState({}, "", "/");
        router();
      });
    }
  });

  return nav;
}

// ✅ SPA routing handler
function handleNavClick(e) {
  e.preventDefault();
  const href = e.target.getAttribute("href");
  console.log("🔗 Navigating to:", href);
  window.history.pushState({}, "", href);
  window.dispatchEvent(new Event("popstate"));
}

// ✅ Logged-out Desktop Auth
function renderAuthLinks() {
  console.log("🔐 Rendering logged-out auth links");
  return `
    <a href="/login" class="px-4 py-2 border border-[#5624d0] text-[#5624d0] rounded hover:bg-gray-100">Login</a>
    <a href="/signup" class="px-4 py-2 bg-[#5624d0] text-white rounded hover:bg-purple-800">Sign Up</a>
  `;
}

// ✅ Logged-in Desktop Dropdown
function renderProfileDropdown(user) {
  const name = user?.name || "User";
  console.log("👤 Rendering profile dropdown for:", name);
  return `
    <div class="relative group">
      <button class="flex items-center gap-2 px-4 py-2 bg-[#5624d0] text-white rounded">
        👤 ${name}
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div class="absolute hidden group-hover:block right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
        <a href="/profile" class="block px-4 py-2 text-sm hover:bg-gray-100">Profile</a>
        <button id="logoutBtn" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
      </div>
    </div>
  `;
}

// ✅ Logged-out Mobile Auth
function renderMobileAuth() {
  console.log("📱 Rendering mobile auth (logged out)");
  return `
    <a href="/login" class="hover:text-[#5624d0]">Login</a>
    <a href="/signup" class="hover:text-[#5624d0]">Sign Up</a>
  `;
}

// ✅ Logged-in Mobile
function renderMobileProfile(user) {
  const name = user?.name || "User";
  console.log("📱 Rendering mobile profile for:", name);
  return `
    <p class="text-sm font-semibold text-[#5624d0]">👤 ${name}</p>
    <button id="logoutBtnMobile" class="text-left text-red-600 hover:underline">Logout</button>
  `;
}

// ✅ Re-bind SPA listeners on dynamic updates
function addLinkListeners(container) {
  container.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", handleNavClick);
  });
}
