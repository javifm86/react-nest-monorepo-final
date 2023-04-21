import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

const swaggerShimFile =
  "node_modules/@nestjs/swagger/dist/extra/swagger-shim.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["@babel/plugin-proposal-decorators", { legacy: true }],
          ["@babel/plugin-proposal-class-properties", { loose: true }],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@nestjs/swagger": path.resolve(__dirname, swaggerShimFile),
    },
  },
});
