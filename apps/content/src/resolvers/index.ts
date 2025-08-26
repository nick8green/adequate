import type {
  Element,
  Page,
  QueryPagesArgs,
  Resolvers,
} from '@content/graph/generated/types';
import { getPages, isBanner, isMarkdown } from '@content/resolvers/pages';

// Resolver functions
// async (parent, args, contextValue, info) => { ... }

const resolvers: Resolvers = {
  Query: {
    pages: async (_, args: QueryPagesArgs) =>
      await getPages(args?.filter ?? undefined),
  },
  Page: {
    __resolveReference: async (page: Page) => {
      const { id } = page;
      if (!id) {
        throw new Error('Page ID is required for resolving reference');
      }
      return await getPages({ id: [id] });
    },
  },
  Element: {
    __resolveType: (obj: Element) => {
      if (isBanner(obj)) return 'Banner';
      if (isMarkdown(obj)) return 'Markdown';
      throw new Error(`Unknown element type: ${JSON.stringify(obj)}`);
    },
  },
};

export default resolvers;
