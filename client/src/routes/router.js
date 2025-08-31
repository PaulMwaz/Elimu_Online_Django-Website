// src/routes/router.js
// -------------------------------------------------------------
// Tiny SPA router (history API)
// - Logs every step for easy debugging
// - Supports static routes and a dynamic /levels/:levelSlug route
// - Intercepts <a data-nav> clicks
// - Exposes navigate() for programmatic navigation
// -------------------------------------------------------------

import { Home } from "../pages/Home.js";
import { About } from "../pages/About.js";
import { Signup } from "../pages/Signup.js";
import { Login } from "../pages/Login.js";
import { Dashboard } from "../pages/Dashboard.js";
import { LevelResourcesPage } from "../pages/LevelResourcesPage.js"; // ✅ new

let _initialized = false;

function getPath() {
  // Normalize: strip trailing slash except on root; drop query/hash
  const url = new URL(window.location.href);
  let p = url.pathname.replace(/\/+$/, "");
  if (p === "") p = "/";
  return p;
}

function mount(viewEl) {
  const content = document.getElementById("page-content");
  if (!content) {
    console.warn("⚠️ router(): #page-content container not found");
    return;
  }
  content.innerHTML = "";
  if (viewEl) content.appendChild(viewEl);
  // UX nicety: scroll to top on route change
  window.scrollTo({ top: 0, behavior: "instant" });
}

// --- Route table ------------------------------------------------------------
// Each entry is { name, match(path) => ({params}|null), render(params) => Node }
const routes = [
  {
    name: "home",
    match: (p) => (p === "/" ? {} : null),
    render: () => Home(),
  },
  {
    name: "about",
    match: (p) => (/^\/about\/?$/.test(p) ? {} : null),
    render: () => About(),
  },
  {
    name: "signup",
    match: (p) => (/^\/signup\/?$/.test(p) ? {} : null),
    render: () => Signup(),
  },
  {
    name: "login",
    match: (p) => (/^\/login\/?$/.test(p) ? {} : null),
    render: () => Login(),
  },

  // Your existing dashboard-style shortcuts (same view, different intent)
  {
    name: "dashboard",
    match: (p) => (/^\/dashboard\/?$/.test(p) ? {} : null),
    render: () => Dashboard(),
  },
  {
    name: "notes",
    match: (p) => (/^\/notes\/?$/.test(p) ? { section: "notes" } : null),
    render: () => Dashboard(),
  },
  {
    name: "ebooks",
    match: (p) => (/^\/ebooks\/?$/.test(p) ? { section: "ebooks" } : null),
    render: () => Dashboard(),
  },
  {
    name: "exams",
    match: (p) => (/^\/exams\/?$/.test(p) ? { section: "exams" } : null),
    render: () => Dashboard(),
  },
  {
    name: "schemes",
    match: (p) => (/^\/schemes\/?$/.test(p) ? { section: "schemes" } : null),
    render: () => Dashboard(),
  },
  {
    name: "lessons",
    match: (p) => (/^\/lessons\/?$/.test(p) ? { section: "lessons" } : null),
    render: () => Dashboard(),
  },

  // ✅ New dynamic route: /levels/:levelSlug  (e.g., /levels/high-school)
  {
    name: "level-resources",
    match: (p) => {
      const m = p.match(/^\/levels\/([a-z0-9-]+)\/?$/i);
      return m ? { levelSlug: m[1] } : null;
    },
    render: (params) => LevelResourcesPage(params),
  },
];

function findRoute(pathname) {
  for (const r of routes) {
    const params = r.match(pathname);
    if (params) return { route: r, params };
  }
  return null;
}

// --- Renderer ---------------------------------------------------------------
function render() {
  const path = getPath();
  console.log(`🔀 [router] navigating to → ${path}`);

  const hit = findRoute(path);
  if (!hit) {
    console.error("❌ [router] 404 No route for:", path);
    mount(
      (() => {
        const div = document.createElement("div");
        div.className = "p-8 text-center";
        div.innerHTML = `
          <h1 class="text-3xl font-bold text-red-600">404 - Page Not Found</h1>
          <p class="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
        `;
        return div;
      })()
    );
    return;
  }

  console.log(
    `📄 [router] render → ${hit.route.name}`,
    hit.params && Object.keys(hit.params).length ? hit.params : ""
  );

  try {
    const view = hit.route.render(hit.params || {});
    mount(view);
  } catch (e) {
    console.error("💥 [router] render error:", e);
    mount(
      (() => {
        const div = document.createElement("div");
        div.className = "p-8 text-center";
        div.innerHTML = `
          <h1 class="text-2xl font-bold text-red-600">Something went wrong</h1>
          <p class="text-gray-600 mt-2">Please try again.</p>
        `;
        return div;
      })()
    );
  }
}

// --- Navigation helpers -----------------------------------------------------
export function navigate(to, { replace = false } = {}) {
  if (!to || typeof to !== "string") return;
  // Ensure a leading slash; strip protocol/host if provided
  const url = new URL(to, window.location.origin);
  const path = url.pathname + url.search + url.hash;
  console.log(`🧭 [router] navigate() → ${path} (replace=${replace})`);
  if (replace) {
    window.history.replaceState({}, "", path);
  } else {
    window.history.pushState({}, "", path);
  }
  render();
}

// Intercept same-origin links with data-nav (or role="link")
// so cards can navigate without a full reload.
function clickInterceptor(e) {
  const a = e
    .composedPath()
    .find((el) => el?.tagName === "A" || el?.dataset?.nav === "true");
  if (!a) return;

  // A link can opt-in in two ways:
  // 1) <a href="/levels/high-school" data-nav="true">...</a>
  // 2) Any element with data-nav="true" and data-href="/path"
  const href = a.getAttribute?.("href") || a.dataset?.href;
  const nav = a.dataset?.nav === "true";
  if (!href || !nav) return;

  // External, target=_blank, download → let browser handle
  if (
    a.target === "_blank" ||
    a.hasAttribute?.("download") ||
    (/^https?:\/\//i.test(href) && !href.startsWith(window.location.origin))
  ) {
    return;
  }

  e.preventDefault();
  navigate(href);
}

// --- Public API -------------------------------------------------------------
export function router() {
  if (!_initialized) {
    console.log("🟣 [router] init");
    window.addEventListener("popstate", () => {
      console.log("↩️  [router] popstate");
      render();
    });
    document.addEventListener("click", clickInterceptor, true);
    // Expose for quick debugging in DevTools
    window.navigate = navigate;
    _initialized = true;
  }
  render();
}
