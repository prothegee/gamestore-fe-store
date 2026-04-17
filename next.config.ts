import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-@ts-expect-error - allowedDevOrigins is required for local network mobile testing
  allowedDevOrigins: ['192.168.1.59', 'localhost:9007'],
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
