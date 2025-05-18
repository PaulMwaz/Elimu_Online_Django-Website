import { Home } from "../pages/Home.js";
import { About } from "../pages/About.js";
import { Signup } from "../pages/Signup.js"; // ✅ Corrected
import { Login } from "../pages/Login.js";
import { Dashboard } from "../pages/Dashboard.js"; // ✅ Include dashboard

export function router() {
  const content = document.getElementById("page-content");
  if (!content) {
    console.warn("⚠️ page-content container not found");
    return;
  }

  // Clear old content
  content.innerHTML = "";

  const path = window.location.pathname;
  console.log(`🔀 Navigating to: ${path}`);

  switch (path) {
    case "/":
      console.log("📄 Rendering Home Page");
      content.appendChild(Home());
      break;

    case "/about":
      console.log("📄 Rendering About Page");
      content.appendChild(About());
      break;

    case "/signup":
      console.log("📄 Rendering Signup Page");
      content.appendChild(Signup());
      break;

    case "/login":
      console.log("📄 Rendering Login Page");
      content.appendChild(Login());
      break;

    case "/dashboard":
      console.log("📄 Rendering Dashboard Page");
      content.appendChild(Dashboard());
      break;

    default:
      console.log("❌ 404 - Unknown Route");
      content.innerHTML = `
        <div class="p-6 text-center">
          <h1 class="text-3xl font-bold text-red-600">404 - Page Not Found</h1>
          <p class="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
        </div>
      `;
  }
}
