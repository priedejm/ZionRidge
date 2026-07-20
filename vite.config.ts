import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  css: {
    // Prevent Vite from searching parent directories for a postcss config;
    // Tailwind v4 is handled entirely by the @tailwindcss/vite plugin above.
    postcss: {},
  },
  server: {
    // Proxies the PHP listings backend (run separately via
    // `php -S localhost:8080 -t server`) so fetch("/list-listings.php") etc.
    // work the same in dev as they will in production (same-origin).
    proxy: {
      "^/.+\\.php$": "http://localhost:8080",
      "/assets/uploaded": "http://localhost:8080",
    },
  },
});
