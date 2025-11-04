import { SiteConfig } from '@app/context/config';
import { getServerClient } from '@app/lib/graphql/client';
import { GET_CONFIG } from '@app/lib/graphql/queries/config';
import { Page } from '@content/graph/generated/types';
import { cache } from 'react';

type NavigationPage = Omit<Page, 'structure' | 'type'> & {
  children?: NavigationPage[];
  label?: string;
  url?: string;
};

export const getConfig = cache(async (): Promise<SiteConfig> => {
  const client = getServerClient();
  const data: any = await client.query({ query: GET_CONFIG }); // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!data) {
    throw new Error('failed to fetch config data');
  }

  // get site navigation config
  const navigation = {
    header: processNavigation(data.data.header.pages, 'header'),
    footer: processNavigation(data.data.footer.pages, 'footer'),
  };

  return { ...data.data.config, navigation };
});

const processNavigation = (
  pages: Page[],
  type: 'header' | 'footer',
): NavigationPage[] => {
  const navigation: NavigationPage[] = [];

  pages
    .toSorted((page1: Page, page2: Page): number => {
      const aPriority =
        page1.meta.navigation?.find((n) => n.type === type.toUpperCase())
          ?.priority ?? 0;
      const bPriority =
        page2.meta.navigation?.find((n) => n.type === type.toUpperCase())
          ?.priority ?? 0;
      return aPriority - bPriority;
    })
    .forEach((page: NavigationPage) => {
      if (!page.meta.parent) {
        return navigation.push({ ...page, children: [] });
      }

      const parent = navigation.find((n) => n.id === page.meta.parent?.id);

      if (!parent) {
        throw new Error(
          `parent page with ID ${page.meta.parent?.id} not found for page ${page.id}`,
        );
      }
      // this needs uncommenting when we want multi-level nav and the render errors are sorted with icons
      parent.children?.push({ ...page, children: [] });
    });

  return navigation;
};
