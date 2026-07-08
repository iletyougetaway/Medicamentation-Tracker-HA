import { defineConfig } from "vite";

const litWhitespaceClass = "`[ " + "\t\n" + "\\f\\r]`";
const escapedLitWhitespaceClass = '"[ \\t\\n\\f\\r]"';
const litNegatedWhitespaceClassStart = "[^ " + "\t\n" + "\\f\\r";
const escapedLitNegatedWhitespaceClassStart = "[^ \\t\\n\\f\\r";

export default defineConfig({
  plugins: [
    {
      name: "escape-lit-whitespace-class",
      generateBundle(_options, bundle) {
        for (const output of Object.values(bundle)) {
          if (output.type === "chunk") {
            output.code = output.code
              .split(litWhitespaceClass)
              .join(escapedLitWhitespaceClass)
              .split(litNegatedWhitespaceClassStart)
              .join(escapedLitNegatedWhitespaceClassStart);
          }
        }
      },
    },
  ],
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
