// src/main.js

// ✅ Import Font Awesome icons
import "@fortawesome/fontawesome-free/css/all.min.css";

// ✅ Import your Tailwind / custom CSS
import "./index.css";

// ✅ Import main app layout
import { App } from "./App.js";

// ✅ Run app on first load
window.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 App Loaded (DOMContentLoaded)");
  window.scrollTo(0, 0);
  App();
});

// ✅ Run app on back/forward navigation
window.addEventListener("popstate", () => {
  console.log("🔙 SPA Navigation (popstate)");
  window.scrollTo(0, 0);
  App();
});
