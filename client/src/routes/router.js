import { Home } from "../pages/Home.js";
import { About } from "../pages/About.js";
import { Register } from "../pages/Register.js";
import { Login } from "../pages/Login.js";

export function router() {
  const content = document.getElementById("page-content");
  if (!content) return;

  content.innerHTML = ""; // Clear previous page content

  switch (window.location.pathname) {
    case "/":
      content.appendChild(Home());
      break;
    case "/about":
      content.appendChild(About());
      break;
    case "/register":
      content.appendChild(Register());
      break;
    case "/login":
      content.appendChild(Login());
      break;
    default:
      content.innerHTML = `
        <div class="p-6 text-center">
          <h1 class="text-3xl font-bold text-red-600">404 - Page Not Found</h1>
          <p class="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
        </div>
      `;
  }
}
