import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/ERP-Project/",
  test: {
    globals: true,
    environment: "jsdom",

    // 🎯 JavaScript-க்கு ஏற்றவாறு setup கோப்பின் பாதை மாற்றப்பட்டுள்ளது
    setupFiles: "./tests/integration/setup.js",

    // 🎯 Unit மற்றும் Integration கோப்புகளை மட்டும் சேர்க்கவும்
    include: [
      "tests/unit/**/*.{test,spec}.{js,jsx}",
      "tests/integration/**/*.{test,spec}.{js,jsx}",
    ],

    // 🎯 Playwright E2E மற்றும் node_modules-ஐ முற்றிலும் தவிர்க்கவும்
    exclude: ["tests/e2e/**/*", "node_modules/**"],
  },
});
