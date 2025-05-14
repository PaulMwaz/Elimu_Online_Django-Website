import { Navbar } from "./components/Navbar.js";
import { Footer } from "./components/Footer.js";
import { router } from "./routes/router.js";

export function App() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  // ✅ Main layout wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "min-h-screen flex flex-col bg-gray-50";

  // ✅ Add fixed Navbar
  const navbar = Navbar();
  wrapper.appendChild(navbar);

  // ✅ Determine if we're on the homepage
  const isHome = window.location.pathname === "/";

  // ✅ Create main content container
  const content = document.createElement("main");
  content.id = "page-content";

  // ✅ Apply conditional padding and top margin
  content.className = isHome
    ? "flex-grow" // no padding or margin for homepage hero layout
    : "flex-grow mt-[80px] px-4 sm:px-6 md:px-8 py-6"; // apply spacing elsewhere

  wrapper.appendChild(content);

  // ✅ Add sticky Footer
  const footer = Footer();
  wrapper.appendChild(footer);

  // ✅ Append full layout to root
  app.appendChild(wrapper);

  // ✅ Load the routed page component
  router();
}
