import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'export',
  basePath: '/nextjs-blog',
  assetPrefix: '/nextjs-blog/',
  trailingSlash: true,
};

export default nextConfig;
