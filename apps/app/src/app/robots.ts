import path from 'node:path';

import { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => {
  const host = '';
  return {
    host,
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/*',
    },
    sitemap: path.join(host, 'sitemap.xml'),
  };
};

export default robots;
