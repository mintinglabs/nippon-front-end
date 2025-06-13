import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'lightboxgoodman.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.presslogic.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.medialens.io',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*', // 前端请求 /api/xxx
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`, // 实际代理到后端
      },
    ];
  },
};

export default nextConfig;
