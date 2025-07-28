import {
  Page,
  QueryPagesArgs,
  Resolvers,
} from '@content/graph/generated/types';
import { getPages } from '@content/resolvers/pages';

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
};

export default resolvers;
