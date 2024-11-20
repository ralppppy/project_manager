import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@modules": path.resolve(__dirname, "./src/modules"),
      "@common": path.resolve(__dirname, "./src/common/index"),
      "@common_root": path.resolve(__dirname, "./src/common"),
      "@state": path.resolve(__dirname, "./src/state_management"),
    },
  },
  server: {
    host: "localhost",
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
      },
      "/public": {
        target: "http://localhost:8080",
      },
    },
  },
});
