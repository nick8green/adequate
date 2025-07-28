import { Page, PageFilter } from '@content/graph/generated/types';

export const getPages = async (filter?: PageFilter): Promise<Page[]> => {
  // eslint-disable-next-line no-console
  console.log('Fetching pages with filter:', filter);

  const data: Page[] = [
    {
      id: '4d55d7df-ba87-4290-b3a1-0ef42d418845',
      slug: '',
      structure: [],
      title: '',
      tags: ['tag1', 'tag2'],
    },
    {
      id: '01e363fc-eae8-4cae-ae0e-131b68ccfc2c',
      slug: 'about',
      structure: [],
      title: 'About Me',
    },
  ];

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
      return tags.filter((tag: string) => (page.tags ?? []).some((t: string) => t === tag)).length > 0;
    }
    return true;
  });
};
