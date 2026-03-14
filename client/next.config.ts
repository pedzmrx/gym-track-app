import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@auth/prisma-adapter'],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  
  async rewrites() {
    return [
      {
        source: '/api/((?!auth).*)',
        destination: 'http://localhost:3000/api/:1*',
      },
    ];
  },
};

export default nextConfig;