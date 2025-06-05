import { defineConfig } from "vite";
import history from "connect-history-api-fallback";

export default defineConfig({
  server: {
    port: 5173,
    open: true,
    // ✅ Remove middlewareMode to allow Vite to run its built-in dev server
  },
  plugins: [
    {
      name: "spa-fallback",
      configureServer(server) {
        server.middlewares.use(
          history({
            disableDotRule: true,
            htmlAcceptHeaders: ["text/html"],
            rewrites: [
              { from: /^\/$/, to: "/index.html" },
              { from: /\/[^.]+$/, to: "/index.html" }, // catch SPA routes like /ebooks
            ],
          })
        );
      },
    },
  ],
});
