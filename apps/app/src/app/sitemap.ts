import { join } from 'node:path';

import { getServerClient } from '@app/lib/graphql/client';
import { GET_SITE_MAP } from '@app/lib/graphql/queries/pages';
import { Page } from '@content/graph/generated/types';
import moment from 'moment';
import { MetadataRoute } from 'next';

type SiteMapPage = Page & {
  lastModified?: string;
  priority: number;
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const host = getHost();

  return (await getPages())
    .toSorted(sortPages)
    .map((page: SiteMapPage, _: number, pages: SiteMapPage[]) => {
      const lastModified = page.meta?.audit?.toSorted(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )[0];

      return {
        lastModified: lastModified
          ? moment(new Date(lastModified.timestamp)).format('YYYY-M-D')
          : undefined,
        priority: getPagePriority(page, pages),
        url: `${getProtocol()}://${join(host, page.slug)}`,
      };
    });
};

const getHost = (): string => {
  return process.env.HOST?.replace(/https?:\/\//, '') ?? 'localhost:3000';
};

const getNavigationPriority = (
  page: SiteMapPage,
  type: 'HEADER' | 'FOOTER',
): number | null => {
  const nav = (page.meta?.navigation ?? []).find((n) => n.type === type);
  return nav ? nav.priority : null;
};

const getPages = async (): Promise<SiteMapPage[]> => {
  try {
    const result = await getServerClient().query<{ pages: { pages: Page[] } }>({
      query: GET_SITE_MAP,
    });
    return (
      result.data?.pages.pages.map((page: Page) => page as SiteMapPage) ?? []
    );
  } catch (error) {
    console.error('error fetching sitemap data:', error);
    return [];
  }
};

const getPagePriority = (
  page: SiteMapPage,
  allPages: SiteMapPage[],
): number => {
  if (page.meta.parent) {
    const parent = allPages.find((p) => p.id === page.meta.parent?.id);
    if (!parent) {
      throw new Error('page parent not found');
    }
    return getPagePriority(parent, allPages) - 0.1;
  }

  if (page.slug === '/') {
    return 1;
  }
  if (page.meta.navigation?.some((n) => n.type === 'HEADER')) {
    return 0.9;
  }
  if (page.meta.navigation?.some((n) => n.type === 'FOOTER')) {
    return 0.8;
  }
  return 0.6;
};

const getProtocol = (): string => {
  if (!process.env.HOST) {
    return 'http';
  }
  return process.env.HOST.startsWith('https') ? 'https' : 'http';
};

const sortPages = (p1: SiteMapPage, p2: SiteMapPage) => {
  const p1HeaderPriority = getNavigationPriority(p1, 'HEADER');
  const p2HeaderPriority = getNavigationPriority(p2, 'HEADER');
  const p1FooterPriority = getNavigationPriority(p1, 'FOOTER');
  const p2FooterPriority = getNavigationPriority(p2, 'FOOTER');

  // Sort by presence of HEADER
  if (p1HeaderPriority !== null && p2HeaderPriority === null) return -1;
  if (p1HeaderPriority === null && p2HeaderPriority !== null) return 1;

  // If both have HEADER, sort by HEADER priority
  if (p1HeaderPriority !== null && p2HeaderPriority !== null) {
    return p1HeaderPriority - p2HeaderPriority;
  }

  // Sort by presence of FOOTER
  if (p1FooterPriority !== null && p2FooterPriority === null) return -1;
  if (p1FooterPriority === null && p2FooterPriority !== null) return 1;

  // If both have FOOTER, sort by FOOTER priority
  if (p1FooterPriority !== null && p2FooterPriority !== null) {
    return p1FooterPriority - p2FooterPriority;
  }

  // sort by latest update timestamp
  const p1LatestAudit = p1.meta.audit?.toSorted(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )[0];
  const p2LatestAudit = p2.meta.audit?.toSorted(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )[0];

  if (p1LatestAudit && p2LatestAudit) {
    return (
      new Date(p2LatestAudit.timestamp).getTime() -
      new Date(p1LatestAudit.timestamp).getTime()
    );
  }

  return 0;
};

export default sitemap;
export const dynamic = 'force-dynamic';
