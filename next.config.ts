import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://res.cloudinary.com/pricetra-cdn/**'), new URL('https://cdn.pricetra.com/**')],
  },
};

export default nextConfig;
