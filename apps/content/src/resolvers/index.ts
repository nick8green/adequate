import { Action, enforce, Entity } from '@acl/enforce';
import type {
  Config,
  Element,
  Page,
  PageConnection,
  QueryPagesArgs,
  Resolvers,
  State,
} from '@content/graph/generated/types';
import { getConfig } from '@content/resolvers/config';
import {
  createPage,
  deletePage,
  getPages,
  isBanner,
  isMarkdown,
  isTimeline,
  updatePage,
} from '@content/resolvers/pages';
import { CursorType, paginate } from '@content/resolvers/pagination';
import { getState } from '@content/resolvers/status';

// Resolver functions
// async (parent, args, contextValue, info) => { ... }

const resolvers: Resolvers = {
  Mutation: {
    createPage: async (_, { input }, context): Promise<Page> => {
      enforce(context.token, Action.WRITE, Entity.PAGE);
      return await createPage(input);
    },
    deletePage: async (_, { id }, context): Promise<boolean> => {
      enforce(context.token, Action.WRITE, Entity.PAGE);
      return await deletePage(id);
    },
    updatePage: async (_, { id, input }, context): Promise<Page> => {
      enforce(context.token, Action.WRITE, Entity.PAGE);
      return await updatePage(id, input);
    },
  },
  Query: {
    config: async (_, __, context): Promise<Config> => {
      enforce(context.token, Action.READ, Entity.CONFIG);
      return await getConfig();
    },
    pages: async (
      _,
      args: QueryPagesArgs,
      context,
    ): Promise<PageConnection> => {
      enforce(context.token, Action.READ, Entity.PAGE);
      const { cursor, filter, limit } = args;
      const rawData = await getPages(filter);
      const [pageInfo, pages] = paginate<Page>(
        rawData,
        CursorType.id,
        cursor,
        limit,
      );
      return {
        pages,
        pageInfo,
        totalCount: rawData.length,
      };
    },
    status: async (): Promise<State> => {
      return await getState();
    },
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
      if (isMarkdown(obj)) return 'MD';
      if (isTimeline(obj)) return 'Timeline';
      throw new Error(`Unknown element type: ${JSON.stringify(obj)}`);
    },
  },
};

export default resolvers;
