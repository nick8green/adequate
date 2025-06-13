import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   serverActions: true,
  //   // This helps with stack traces
  //   typedRoutes: true,
  // },

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
