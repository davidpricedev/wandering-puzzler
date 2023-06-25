// import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgrPlugin(), viteTsconfigPaths()],
  build: {
    outDir: "docs",
    rollupOptions: {},
  },
  server: { open: true },
});
