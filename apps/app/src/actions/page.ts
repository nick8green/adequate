import { getServerClient } from '@app/lib/graphql/client';
import { GET_PAGE_BY_SLUG } from '@app/lib/graphql/queries/pages';
import type { Page, PageConnection } from '@content/graph/generated/types';
import { cache } from 'react';

export const getPageData = cache(async (slug: string): Promise<Page> => {
  if (slug === undefined) {
    throw new Error('slug is required to retrieve page data');
  }

  const client = getServerClient();

  const { data } = await client.query({
    query: GET_PAGE_BY_SLUG,
    variables: { slug },
  });

  return (data as { pages: PageConnection }).pages.pages[0];
});
