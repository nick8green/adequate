import { MetadataRoute } from 'next';

const sitemap = (): MetadataRoute.Sitemap => {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
    },
  ];
};
export default sitemap;
