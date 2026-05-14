import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    server: {
     host: "::",
     port: 8080,
     allowedHosts: ["*.ngrok-free.app", "e39e-168-0-103-218.ngrok-free.app"],
     hmr: {
       overlay: false,
     },
   },
   plugins: [react(), sentryVitePlugin({
     org: "gitestrelas",
     project: "vite-react-shadcn-ts",
     authToken: process.env.SENTRY_AUTH_TOKEN,
   })].filter(Boolean),
   resolve: {
     alias: {
       "@": path.resolve(__dirname, "./src"),
     },
     dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
   },
}));
