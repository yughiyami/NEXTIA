import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native / resolve-at-runtime modules must not be bundled by Turbopack —
  // sqlite-vec uses import.meta.resolve and better-sqlite3 loads a .node addon.
  serverExternalPackages: ["better-sqlite3", "sqlite-vec"],
};

export default nextConfig;
