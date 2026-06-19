import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Stabilize dev server on Windows/embedded browsers by disabling
    // the segment explorer devtool (can trigger RSC manifest corruption).
    devtoolSegmentExplorer: false,
  },
};

export default nextConfig;
