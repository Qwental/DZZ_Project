import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // swcMinify: true,
  //   output: "export",
  // webpack: (config: any) => {
  //   config.optimization = {
  //     ...config.optimization,
  //     usedExports: true,
  //     minimize: true,
  //   };
  //   return config;
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com",
        port: "",
        pathname: "**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
