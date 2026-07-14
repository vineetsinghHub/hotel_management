// Vite config for the b2b-pms admin console. STAGED — see README.

import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5174,
      strictPort: true,
      allowedHosts: true,
      hmr: { clientPort: 443, protocol: "wss" },
      fs: {
        allow: [path.resolve(__dirname, "..", "..")],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@aura/shared": path.resolve(__dirname, "../../packages/shared/src"),
        "@aura/ui-core": path.resolve(__dirname, "../../packages/ui-core/src"),
        "@aura/b2b-pms": path.resolve(__dirname, "src"),
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
