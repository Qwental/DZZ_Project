import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: true,
  output: "export",
  experimental: {
    forceSwcTransforms: true, 
  },
  webpack: (config: any) => {
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      minimize: true, 
    };
    return config;
  },
};

export default nextConfig;
