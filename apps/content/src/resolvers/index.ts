import type {
  Element,
  Page,
  PageConnection,
  QueryPagesArgs,
  Resolvers,
} from '@content/graph/generated/types';
import {
  getPages,
  isBanner,
  isMarkdown,
  isTimeline,
} from '@content/resolvers/pages';
import { CursorType, paginate } from '@content/resolvers/pagination';

// Resolver functions
// async (parent, args, contextValue, info) => { ... }

const resolvers: Resolvers = {
  Query: {
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
