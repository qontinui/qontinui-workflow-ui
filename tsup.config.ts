import { defineConfig } from "tsup";

// `{ resolve: true }` makes dts worker errors fatal (Phase 3 Item 8).
export default defineConfig({
  entry: ["src/index.ts", "src/components/index.ts", "src/components/chat/index.ts", "src/components/state-machine/index.ts", "src/config/phase-colors.ts"],
  format: ["esm", "cjs"],
  dts: { resolve: true },
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom", "@xyflow/react"],
});
