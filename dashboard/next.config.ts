import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin Turbopack's workspace root to this folder so Next.js doesn't walk up
  // into the parent (which has a .git folder) and misreport the workspace.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
