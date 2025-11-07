import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
    rollupOptions: {
      input: {
        main: './index.html',
        auth: './auth.html',
        dashboard: './dashboard.html',
        universe: './universe.html',
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
}));
