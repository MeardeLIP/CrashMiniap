import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "/CrashMiniap/", // для GitHub Pages: замени на имя своего репо (например "/crash-bunny/")
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
    include: ["tests/**/*.test.{ts,tsx}"]
  }
});

