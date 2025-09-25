import { Element, Page } from '@content/graph/generated/types';
import { client } from '@repository/client';

let pages: Page[] | null = null;
const dataType = 'page';

export const getPages = async (): Promise<Page[]> => {
  console.log('Fetching pages from repository...'); // eslint-disable-line no-console
  if (pages) {
    return pages;
  }
  console.log('Cache miss, loading pages from repository...'); // eslint-disable-line no-console
  pages = await client.get<Page[]>(dataType);
  setTimeout(() => {
    pages = null;
  }, 1000);
  return pages;
};

export const getPage = async (id: string): Promise<Page | null> => {
  console.log(`Fetching page ${id} from repository...`); // eslint-disable-line no-console
  if (!pages) {
    await getPages();
  }
  if (!pages) {
    throw new Error('Failed to load pages!');
  }
  return pages.find((page) => page.id === id) || null;
};

export const createPage = async (page: Page): Promise<Page> => {
  console.log(`Creating page ${page.id} in repository...`); // eslint-disable-line no-console
  await client.add<Page>(dataType, page);
  return page;
};

export const updatePage = async (
  id: string,
  page: Partial<Page>,
): Promise<Page> => {
  console.log(`Updating page ${id} in repository...`); // eslint-disable-line no-console
  await client.update<Page>(dataType, page as Page, { id });
  return (await getPage(id)) as Page;
};

export const deletePage = async (id: string): Promise<boolean> => {
  console.log(`Deleting page ${id} from repository...`); // eslint-disable-line no-console
  await client.delete(dataType, { id });
  return (await getPage(id)) === null;
};

export const getContentStructure = async (id: string): Promise<Element[]> => {
  console.log(`Fetching content structure for page ${id} from repository...`); // eslint-disable-line no-console
  const page = await getPage(id);
  if (!page) {
    throw new Error('Page not found');
  }
  return [];
};
