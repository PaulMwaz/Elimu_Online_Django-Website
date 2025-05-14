import "./index.css";
import { App } from "./App.js";

// Run app on first load
window.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0); // Ensure top of page on load
  App();
});

// Run app on back/forward navigation
window.addEventListener("popstate", () => {
  window.scrollTo(0, 0); // Reset scroll on navigation
  App();
});
