import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // a stray lockfile in the home directory makes Next guess the wrong
    // workspace root — pin it to this project
    root: path.join(__dirname),
  },
};

export default nextConfig;
