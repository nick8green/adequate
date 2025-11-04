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
import { getAuditRecords } from '@content/resolvers/audit';
import { getConfig } from '@content/resolvers/config';
import {
  createPage,
  deletePage,
  getPages,
  resolveElementType,
  updatePage,
} from '@content/resolvers/pages';
import { CursorType, paginate } from '@content/resolvers/pagination';
import { getState } from '@content/resolvers/status';

// Resolver functions
// async (parent, args, contextValue, info) => { ... }

const resolvers: Resolvers = {
  Element: {
    __resolveType: (obj: Element) => resolveElementType(obj),
  },
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
  Page: {
    __resolveReference: async (page: Page) => {
      const { id } = page;
      if (!id) {
        throw new Error('Page ID is required for resolving reference');
      }
      return await getPages({ id: [id] });
    },
  },
  PageMeta: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    audit: async (parent: any) => getAuditRecords(parent.id, 'PAGE'),
  },
  PostMeta: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    audit: async (parent: any) => {
      console.log('fetching post audit records for post:', parent);
      return getAuditRecords(parent.id, 'POST');
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
};

export default resolvers;
