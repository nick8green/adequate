import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
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
      {
        source: '/_clear',
        destination: '/api/clear',
      },
    ];
  },
};

export default nextConfig;
