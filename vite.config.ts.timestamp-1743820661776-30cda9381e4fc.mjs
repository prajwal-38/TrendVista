// vite.config.ts
import { defineConfig } from "file:///C:/Users/admin/Desktop/MAIN/github/proba-trend-vista-main/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/admin/Desktop/MAIN/github/proba-trend-vista-main/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { nodePolyfills } from "file:///C:/Users/admin/Desktop/MAIN/github/proba-trend-vista-main/node_modules/vite-plugin-node-polyfills/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\admin\\Desktop\\MAIN\\github\\proba-trend-vista-main";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // To exclude specific polyfills, add them to this list
      exclude: [
        "fs"
        // Excludes the polyfill for 'fs' and 'node:fs'
      ],
      // Whether to polyfill specific globals
      globals: {
        Buffer: true,
        global: true,
        process: true
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    host: "localhost",
    // Change from specific IP to localhost
    port: 3e3
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhZG1pblxcXFxEZXNrdG9wXFxcXE1BSU5cXFxcZ2l0aHViXFxcXHByb2JhLXRyZW5kLXZpc3RhLW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFkbWluXFxcXERlc2t0b3BcXFxcTUFJTlxcXFxnaXRodWJcXFxccHJvYmEtdHJlbmQtdmlzdGEtbWFpblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYWRtaW4vRGVza3RvcC9NQUlOL2dpdGh1Yi9wcm9iYS10cmVuZC12aXN0YS1tYWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBub2RlUG9seWZpbGxzIH0gZnJvbSAndml0ZS1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBub2RlUG9seWZpbGxzKHtcbiAgICAgIC8vIFRvIGV4Y2x1ZGUgc3BlY2lmaWMgcG9seWZpbGxzLCBhZGQgdGhlbSB0byB0aGlzIGxpc3RcbiAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgJ2ZzJywgLy8gRXhjbHVkZXMgdGhlIHBvbHlmaWxsIGZvciAnZnMnIGFuZCAnbm9kZTpmcydcbiAgICAgIF0sXG4gICAgICAvLyBXaGV0aGVyIHRvIHBvbHlmaWxsIHNwZWNpZmljIGdsb2JhbHNcbiAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgQnVmZmVyOiB0cnVlLFxuICAgICAgICBnbG9iYWw6IHRydWUsXG4gICAgICAgIHByb2Nlc3M6IHRydWUsXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6ICdsb2NhbGhvc3QnLCAvLyBDaGFuZ2UgZnJvbSBzcGVjaWZpYyBJUCB0byBsb2NhbGhvc3RcbiAgICBwb3J0OiAzMDAwXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyVyxTQUFTLG9CQUFvQjtBQUN4WSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCO0FBSDlCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQTtBQUFBLE1BRVosU0FBUztBQUFBLFFBQ1A7QUFBQTtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsU0FBUztBQUFBLFFBQ1AsUUFBUTtBQUFBLFFBQ1IsUUFBUTtBQUFBLFFBQ1IsU0FBUztBQUFBLE1BQ1g7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
