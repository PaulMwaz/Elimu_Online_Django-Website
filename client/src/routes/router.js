import { Home } from "../pages/Home.js";
import { About } from "../pages/About.js";
import { Signup } from "../pages/Signup.js";
import { Login } from "../pages/Login.js";
import { Dashboard } from "../pages/Dashboard.js";

export function router() {
  const content = document.getElementById("page-content");
  if (!content) {
    console.warn("⚠️ router(): #page-content container not found");
    return;
  }

  // Clear existing content
  content.innerHTML = "";

  const path = window.location.pathname;
  console.log(`🔀 router(): Navigating to → ${path}`);

  // ✅ All these routes use the same Dashboard view
  const dashboardRoutes = [
    "/dashboard",
    "/notes",
    "/ebooks",
    "/exams",
    "/schemes",
    "/lessons",
  ];

  if (path === "/") {
    console.log("📄 Rendering → Home");
    content.appendChild(Home());
  } else if (path === "/about") {
    console.log("📄 Rendering → About");
    content.appendChild(About());
  } else if (path === "/signup") {
    console.log("📄 Rendering → Signup");
    content.appendChild(Signup());
  } else if (path === "/login") {
    console.log("📄 Rendering → Login");
    content.appendChild(Login());
  } else if (dashboardRoutes.includes(path)) {
    console.log(`📄 Rendering Dashboard for → ${path}`);
    content.appendChild(Dashboard());
  } else {
    console.error("❌ 404 - Unknown route:", path);
    content.innerHTML = `
      <div class="p-8 text-center">
        <h1 class="text-3xl font-bold text-red-600">404 - Page Not Found</h1>
        <p class="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
      </div>
    `;
  }
}
