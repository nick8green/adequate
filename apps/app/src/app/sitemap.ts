import { MetadataRoute } from 'next';

const sitemap = (): MetadataRoute.Sitemap => {
  return [
    {
      url: 'https://nick8green.co.uk',
      lastModified: new Date(),
    },
  ];
};
export default sitemap;
