import { QueryPagesArgs, Resolvers } from '@content/graph/generated/types';
import { getPages } from '@content/resolvers/pages';

// Resolver functions
// async (parent, args, contextValue, info) => { ... }

const resolvers: Resolvers = {
  Query: {
    pages: async (_, args: QueryPagesArgs) =>
      await getPages(args?.filter ?? undefined),
  },
};

export default resolvers;
