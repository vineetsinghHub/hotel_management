// Vite config for the b2c-engine guest storefront.
// Currently STAGED — not activated. Supervisor still runs the monolithic
// frontend at /app/frontend. When we're ready to split dev servers, point
// supervisor at `yarn workspace @aura/b2c-engine dev` on port 5173 and
// update nginx to route `/`, `/t/:slug/*` (guest routes) to :5173.

import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      allowedHosts: true,
      hmr: { clientPort: 443, protocol: "wss" },
      fs: {
        allow: [
          path.resolve(__dirname, "..", ".."),
        ],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@aura/shared": path.resolve(__dirname, "../../packages/shared/src"),
        "@aura/ui-core": path.resolve(__dirname, "../../packages/ui-core/src"),
        "@aura/b2c-engine": path.resolve(__dirname, "src"),
      },
    },
    envPrefix: ["REACT_APP_", "VITE_"],
    define: {
      "process.env.REACT_APP_BACKEND_URL": JSON.stringify(env.REACT_APP_BACKEND_URL || ""),
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
    build: { outDir: "dist" },
  };
});
