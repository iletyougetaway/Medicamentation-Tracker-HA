import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "../custom_components/medication_manager/frontend",
    emptyOutDir: true,
    lib: {
      entry: "src/medication-manager-card.ts",
      formats: ["es"],
      fileName: () => "medication-manager-card.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: "medication-manager-card.[ext]",
      },
    },
  },
});
