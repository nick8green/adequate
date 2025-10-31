import { Page } from '@content/graph/generated/types';

let pages: Page[] | null = null;

export const getPages = async (): Promise<Page[]> => {
  setTimeout(() => {
    pages = null;
  }, 1000);
  throw new Error('Not implemented yet!');
};

export const getPage = async (id: string): Promise<Page | null> => {
  throw new Error('Not implemented yet!');
};

export const createPage = async (page: Page): Promise<Page> => {
  throw new Error('Not implemented yet!');
};

export const updatePage = async (
  id: string,
  page: Partial<Page>,
): Promise<Page> => {
  throw new Error('Not implemented yet!');
};

export const deletePage = async (id: string): Promise<boolean> => {
  throw new Error('Not implemented yet!');
};

export const getContentStructure = async (id: string): Promise<any[]> => {
  throw new Error('Not implemented yet!');
};
