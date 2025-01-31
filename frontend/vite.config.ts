import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import process from "process";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: { port: 3000 },
    preview: { port: 3000 },
    plugins: [react()],
    base: env.BASE_URL || "",
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "#root": resolve(__dirname),
        "@backedntypes": resolve(
          __dirname,
          "..",
          "backend",
          "src",
          "types",
          "LocalTypes"
        ),
      },
    },
    define: {
      __BASE_URL__: JSON.stringify(env.BASE_URL || ""),
      __BACKEND_URL__: JSON.stringify(
        env.BACKEND_URL || "http://localhost:5000"
      ),
    },
  };
});
