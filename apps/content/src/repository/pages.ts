import { Element, Page, PageType } from '@content/graph/generated/types';
import { client } from '@repository/client';

type PageRepository = Page & {
  meta_description: string;
  meta_title: string;
  uuid: string;
};
type PageElement = Element & { page: string; priority: number };

let pages: PageRepository[] | null = null;
let structure: PageElement[] | null = null;

const dataType = 'pages';

export const getPages = async (): Promise<PageRepository[]> => {
  console.log('Fetching pages from repository...'); // eslint-disable-line no-console
  if (pages) {
    return pages;
  }

  console.log('Cache miss, loading pages from repository...'); // eslint-disable-line no-console
  pages = await client.get<PageRepository>(dataType);

  pages.forEach((page) => {
    // @ts-expect-error creating a new meta object which is invalid until data is assigned
    page.meta = {};
    for (const key in page) {
      if (key.startsWith('meta_')) {
        const metaKey = key.replace('meta_', '');
        // @ts-expect-error due to dynamic key assignment
        page.meta[metaKey] = page[key];
      }
    }
    page.type = page.type.toUpperCase() as PageType;
  });

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
  if (!structure) {
    structure ??= await client.get<PageElement>('content');
    setTimeout(() => {
      structure = null;
    }, 1000);
  }
  return structure
    .filter((el) => el.page === id)
    .sort((a, b) => a.priority - b.priority) as unknown as Element[];
};
