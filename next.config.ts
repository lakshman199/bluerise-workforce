import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // The dev server binds 0.0.0.0 so the preview can reach it; without this, HMR
  // requests from the loopback host are rejected as cross-origin.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
