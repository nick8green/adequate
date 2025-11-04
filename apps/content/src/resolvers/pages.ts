import {
  Banner,
  Element,
  Md,
  Page,
  PageFilter,
  PageInput,
  Post,
  Timeline,
} from '@content/graph/generated/types';
import repo from '@content/repository/Pages';

export const getPages = async (filter?: null | PageFilter): Promise<Page[]> => {
  const data: Page[] = await repo.getAll();
  console.log('fetched pages', data.length, filter);
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
    if (filter?.navigation) {
      return page.meta.navigation?.some(
        (nav) => nav.type === filter.navigation,
      );
    }
    return true;
  });
};

export const createPage = async (input: PageInput): Promise<Page> => {
  // validate there is no existing page with the same slug
  const existing = await getPages();
  if (existing.find((p) => p.slug === input.slug)) {
    throw new Error('a page with the same slug already exists');
  }
  console.log('creating page', input);

  const newPage: Page = await repo.create(input);
  if (!newPage) {
    throw new Error('failed to create page');
  }

  return newPage;
};

export const updatePage = async (
  id: string,
  input: PageInput,
): Promise<Page> => {
  // validate there is no existing page with the same slug
  const existing = await getPages();
  if (existing.find((p) => p.slug === input.slug && p.id !== id)) {
    throw new Error('a page with the same slug already exists');
  }
  console.log('updating page', id, input);

  const updatedPage: Page = await repo.update(id, input);
  if (!updatedPage) {
    throw new Error('failed to update page');
  }

  return updatedPage;
};

export const deletePage = async (id: string): Promise<boolean> => {
  return await repo.delete(id);
};

export const resolveElementType = (element: Element) => {
  if (isBanner(element)) return 'Banner';
  if (isPost(element)) return 'Post';
  if (isTimeline(element)) return 'Timeline';
  if (isMarkdown(element)) return 'MD';
  throw new Error(`Unknown element type: ${JSON.stringify(element)}`);
};

// structure element type guards

export const isBanner = (element: Element): element is Banner =>
  (element as Banner).title !== undefined &&
  (element as Banner).description !== undefined &&
  (element as Banner).image !== undefined &&
  (element as Banner).side !== undefined;

export const isMarkdown = (element: Element): element is Md =>
  (element as Md).content !== undefined;

export const isPost = (element: Element): element is Post =>
  (element as Post).content !== undefined &&
  (element as Post).id !== undefined &&
  (element as Post).slug !== undefined &&
  (element as Post).title !== undefined;

export const isTimeline = (element: Element): element is Timeline =>
  (element as Timeline).events !== undefined;
