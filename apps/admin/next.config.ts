import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/status',
        destination: '/api/status',
      },
      {
        source: '/metrics',
        destination: '/api/metrics',
      },
    ];
  },
};

export default nextConfig;
