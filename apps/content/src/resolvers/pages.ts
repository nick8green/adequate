import {
  Banner,
  Element,
  Md,
  Page,
  PageFilter,
  Timeline,
} from '@content/graph/generated/types';
import { getPages as getPagesData } from '@content/repository/pages';

export const getPages = async (filter?: PageFilter): Promise<Page[]> => {
  // eslint-disable-next-line no-console
  console.log('Fetching pages with filter:', filter);

  const data: Page[] = await getPagesData();

  // const data: Page[] = [
  //   {
  //     id: '4d55d7df-ba87-4290-b3a1-0ef42d418845',
  //     slug: '',
  //     structure: getPageStructure(1),
  //     title: '',
  //     tags: ['tag1', 'tag2'],
  //   },
  //   {
  //     id: '01e363fc-eae8-4cae-ae0e-131b68ccfc2c',
  //     slug: 'about',
  //     structure: [],
  //     title: 'About Me',
  //   },
  // ];

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

// const getPageStructure = (id: number): Element[] => {
//   console.log('Getting structure for page', id); // eslint-disable-line no-console
//   return [
//     {
//       title: 'About Us',
//       description: 'This is the about page.',
//       image: '/assets/images/coding.jpg',
//       side: 'left',
//     } as Banner,
//     {
//       content: 'This is the about page content.',
//     } as Md,
//     {
//       title: 'Contact Us',
//       description: 'This is the contact page.',
//       image: '/assets/images/desk.jpg',
//       side: 'right',
//     } as Banner,
//   ];
// };

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
