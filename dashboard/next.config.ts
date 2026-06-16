import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin Turbopack's workspace root to this folder so Next.js doesn't walk up
  // into the parent (which has a .git folder) and misreport the workspace.
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Allow ngrok tunnel hosts to reach the dev server (used for Meta WhatsApp
  // webhook testing). Next.js 16 otherwise blocks cross-origin requests in dev.
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app", "*.ngrok.app"],
};

export default nextConfig;
