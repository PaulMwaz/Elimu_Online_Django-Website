// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import history from "connect-history-api-fallback";

// Small helper to pretty-print objects safely
const j = (v) => {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
};

export default defineConfig(({ mode }) => {
  // Load env for visibility; Vite exposes only VITE_* to the client, but we can log here.
  const env = loadEnv(mode, process.cwd(), "");
  const DEV_API_PROXY_TARGET =
    env.DEV_API_PROXY_TARGET || "http://127.0.0.1:8000";

  // On startup, print a concise summary so you immediately see what’s happening.
  console.log("────────────────────────────────────────────────────────────");
  console.log("🟢 Vite starting");
  console.log("  • MODE:", mode);
  console.log("  • DEV_API_PROXY_TARGET:", DEV_API_PROXY_TARGET);
  console.log("  • VITE_API_URL (client):", env.VITE_API_URL || "(not set)");
  console.log("────────────────────────────────────────────────────────────");

  return {
    plugins: [
      react(),
      {
        name: "spa-fallback-with-logs",
        configureServer(server) {
          console.log(
            "🚀 Vite dev server: SPA fallback + request logger enabled"
          );

          // SPA fallback (Vite already has one; this makes it explicit and logs)
          server.middlewares.use(
            history({
              disableDotRule: true,
              htmlAcceptHeaders: ["text/html"],
              rewrites: [
                { from: /^\/$/, to: "/index.html" }, // Root
                { from: /\/[^.]+$/, to: "/index.html" }, // Client routes (/dashboard, /login, etc.)
              ],
            })
          );

          // Basic request logger (method + URL)
          server.middlewares.use((req, _res, next) => {
            console.log(`📡 [req] ${req.method} ${req.url}`);
            next();
          });
        },
        configurePreviewServer(previewServer) {
          console.log("🧪 Vite preview server running (uses built files)");
          return () => {};
        },
      },
    ],

    // Dev server config
    server: {
      port: 5173,
      open: true,
      strictPort: true, // Fail fast if 5173 is in use
      proxy: {
        // Mirror production: the browser calls /api/*, Vite proxies to Django.
        "/api": {
          target: DEV_API_PROXY_TARGET, // e.g., http://127.0.0.1:8000
          changeOrigin: true,
          secure: false,
          ws: false,
          // Optional: extra proxy logging
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq, req) => {
              console.log(
                `🔁 [proxyReq] ${req.method} ${req.url} -> ${DEV_API_PROXY_TARGET}`
              );
            });
            proxy.on("proxyRes", (proxyRes, req) => {
              console.log(
                `✅ [proxyRes] ${req.method} ${req.url} <- ${proxyRes.statusCode} from ${DEV_API_PROXY_TARGET}`
              );
            });
            proxy.on("error", (err, req) => {
              console.error(
                `❌ [proxyErr] ${req.method} ${req.url}:`,
                err?.message || err
              );
            });
          },
        },
      },
    },

    // Build/preview tweaks (nice for debugging prod issues)
    build: {
      sourcemap: true, // easier debugging of built code
    },
    preview: {
      port: 5174,
      strictPort: true,
    },

    // Extra logs at config time (one-time)
    logLevel: "info",
    define: {
      __APP_INFO__: JSON.stringify({
        mode,
        VITE_API_URL: env.VITE_API_URL || null,
      }),
    },
  };
});
