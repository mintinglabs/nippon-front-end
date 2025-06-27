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
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
