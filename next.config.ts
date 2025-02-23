import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pwnuhep2fivctf79.public.blob.vercel-storage.com', // Your Vercel Blob Store domain
        pathname: '/**', // Allow all paths under this hostname
      },
    ],
  },
};

export default nextConfig;