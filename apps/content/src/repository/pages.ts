import { Element, Page } from '@content/graph/generated/types';
import { client } from '@repository/index';

let pages: Page[] | null = null;
const dataType = 'pages';

export const getPages = async (): Promise<Page[]> => {
  setTimeout(() => {
    pages = null;
  }, 1000);
  pages = await client.get<Page[]>(dataType);
  return pages;
};

export const getPage = async (id: string): Promise<Page | null> => {
  if (!pages) {
    await getPages();
  }
  if (!pages) {
    throw new Error('Failed to load pages!');
  }
  return pages.find((page) => page.id === id) || null;
};

export const createPage = async (page: Page): Promise<Page> => {
  client.add<Page>(dataType, page);
  return page;
};

export const updatePage = async (
  id: string,
  page: Partial<Page>,
): Promise<Page> => {
  client.update<Page>(dataType, page as Page, { id });
  return (await getPage(id)) as Page;
};

export const deletePage = async (id: string): Promise<boolean> => {
  client.delete(dataType, { id });
  return (await getPage(id)) === null;
};

export const getContentStructure = async (id: string): Promise<Element[]> => {
  const page = await getPage(id);
  if (!page) {
    throw new Error('Page not found');
  }
  return [];
};
