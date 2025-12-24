import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      new URL("https://cdn.pricetra.com/**"),
    ],
  },
};

export default nextConfig;
