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
        hostname: 'amjpdf1.blr1.digitaloceanspaces.com', 
        pathname: '/**', // Allow all paths under this hostname
      }
    ],
  },
};

export default nextConfig;