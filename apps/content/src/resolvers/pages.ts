import {
  Banner,
  Element,
  Md,
  Page,
  PageFilter,
  Timeline,
} from '@content/graph/generated/types';
import { getPages as getPagesData, getContentStructure as getPageStructure } from '@content/repository/pages';

export const getPages = async (filter?: PageFilter): Promise<Page[]> => {
  const data: Page[] = await getPagesData();
  for (const page of data) {
    const structure = await getPageStructure(page.id);
    page.structure = structure;
  }

  if (!filter) {
    return data;
  }

  return data.filter((page) => {
    if (filter?.id) {
      const checks = Array.isArray(filter.id) ? filter.id : [filter.id];
      return checks.includes(page.id);
    }
    if (filter?.slug) {
      return page.slug === filter.slug;
    }
    if (filter?.tags) {
      const tags = Array.isArray(filter.tags) ? filter.tags : [filter.tags];
      return (
        tags.filter((tag: string) =>
          (page.tags ?? []).some((t: string) => t === tag),
        ).length > 0
      );
    }
    return true;
  });
};

// structure element type guards

export const isBanner = (element: Element): element is Banner => {
  return (
    (element as Banner).title !== undefined &&
    (element as Banner).description !== undefined &&
    (element as Banner).image !== undefined &&
    (element as Banner).side !== undefined
  );
};

export const isMarkdown = (element: Element): element is Md => {
  return (element as Md).content !== undefined;
};

export const isTimeline = (element: Element): element is Timeline => {
  return false; // Placeholder for future implementation
};
