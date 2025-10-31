import { SiteConfig } from '@app/context/config';
import { getServerClient } from '@app/lib/graphql/client';
import { GET_CONFIG } from '@app/lib/graphql/queries/config';
import { cache } from 'react';

export const getConfig = cache(async (): Promise<SiteConfig> => {
  const client = getServerClient();
  const data = await Promise.all([
    // fetch config from backend
    client.query({ query: GET_CONFIG }),
    // fetch navigation from backend
    // client.query({ query: GET_NAVIGATION }),
  ]);
  console.log('Fetched config data:', data[0]); // eslint-disable-line no-console

  // get site config from back end
  // get site navigation config
  const navigation = [
    { url: '/', label: 'Home' },
    { url: '/about', label: 'About' },
    { url: '/contact', label: 'Contact' },
    {
      url: '/blog',
      label: 'Blog',
      children: [
        // { url: '/blog/post-1', label: 'Article 1' },
        // { url: '/blog/post-2', label: 'Article 2' },
        // { url: '/blog/post-3', label: 'Article 3' },
      ],
    },
  ];

  return { ...(data[0].data as { config: SiteConfig }).config, navigation };
});
