import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages: https://<org>.github.io/world-cup-2026-quinela/
export default defineConfig({
  plugins: [react()],
  base: "/world-cup-2026-quinela/",
});
