import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` emits ./out, deployable to any static host
  // (Netlify, Cloudflare Pages, GitHub Pages, cPanel, an S3 bucket...).
  output: "export",
  trailingSlash: true,
  images: {
    // No Node server at runtime, so the built-in optimizer is off. The photos
    // are pre-compressed to webp by scripts/prep-assets.mjs instead.
    unoptimized: true,
  },
};

export default nextConfig;
