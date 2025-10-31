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
  getPages,
  isBanner,
  isMarkdown,
  isTimeline,
} from '@content/resolvers/pages';
import { CursorType, paginate } from '@content/resolvers/pagination';
import { getState } from '@content/resolvers/status';

// Resolver functions
// async (parent, args, contextValue, info) => { ... }

const resolvers: Resolvers = {
  Query: {
    config: async (): Promise<Config> => {
      return await getConfig();
    },
    pages: async (_, args: QueryPagesArgs): Promise<PageConnection> => {
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
