// vite.config.js
import { defineConfig } from "vite";
import history from "connect-history-api-fallback";

// ✅ Export Vite configuration
export default defineConfig({
  server: {
    port: 5173,
    open: true,
    strictPort: true, // ✅ Fail fast if port is already in use
  },
  plugins: [
    {
      name: "spa-fallback",
      configureServer(server) {
        console.log("🚀 Vite dev server with SPA fallback enabled");

        server.middlewares.use(
          history({
            disableDotRule: true,
            htmlAcceptHeaders: ["text/html"],
            rewrites: [
              { from: /^\/$/, to: "/index.html" }, // ✅ Root path
              { from: /\/[^.]+$/, to: "/index.html" }, // ✅ Other SPA routes
            ],
          })
        );

        server.middlewares.use((req, res, next) => {
          console.log("📡 Incoming request:", req.method, req.url);
          next();
        });
      },
    },
  ],
});
