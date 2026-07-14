import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Vite configuration for Aura Hotels frontend.
// Migration from CRA/Craco: keeps @ alias, port 3000, host 0.0.0.0, and the
// existing REACT_APP_* env-var convention (via envPrefix + a define shim
// so components can keep reading `process.env.REACT_APP_BACKEND_URL`).

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ["REACT_APP_", "VITE_"]);

  return {
    plugins: [
      react({
        // Also apply Fast Refresh to plain .js files (we still have App.js
        // and index.js with JSX). Renaming everything is a separate cleanup.
        include: "**/*.{js,jsx,ts,tsx}",
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@aura/shared": path.resolve(__dirname, "../packages/shared/src"),
        "@aura/ui-core": path.resolve(__dirname, "../packages/ui-core/src"),
        "@aura/b2c-engine": path.resolve(__dirname, "../apps/b2c-engine/src"),
        "@aura/b2b-pms": path.resolve(__dirname, "../apps/b2b-pms/src"),
        "@aura/super-admin": path.resolve(__dirname, "../apps/super-admin/src"),
      },
    },

    // Keep the REACT_APP_ prefix so the checked-in .env stays untouched.
    envPrefix: ["REACT_APP_", "VITE_"],

    // Shim `process.env.REACT_APP_*` reads so existing components work unchanged.
    define: {
      "process.env.REACT_APP_BACKEND_URL": JSON.stringify(env.REACT_APP_BACKEND_URL || ""),
      "process.env.NODE_ENV": JSON.stringify(mode),
      "process.env.REACT_APP_SHOW_TENANT_SWITCHER": JSON.stringify(env.REACT_APP_SHOW_TENANT_SWITCHER || ""),
    },

    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
      // The Kubernetes ingress terminates TLS externally and forwards over
      // HTTP; allow the HMR websocket to be reached through the same host.
      hmr: { clientPort: 443, protocol: "wss" },
      // Preview environments front the container with a wildcard host.
      allowedHosts: true,
      watch: {
        ignored: ["**/node_modules/**", "**/.git/**", "**/build/**", "**/dist/**"],
      },
    },

    build: {
      outDir: "build",
      sourcemap: false,
      // Chunk long-tail heavy libs so the storefront's first paint stays quick.
      rollupOptions: {
        output: {
          manualChunks: {
            recharts: ["recharts"],
            radix: [
              "@radix-ui/react-dialog",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-popover",
              "@radix-ui/react-tabs",
            ],
          },
        },
      },
    },
  };
});
