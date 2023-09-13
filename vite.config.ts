import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: { target: "es2019" }, // Required for older Android WebView versions
  plugins: [react()],
});
