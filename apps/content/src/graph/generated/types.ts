import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
  Markdown: { input: any; output: any };
};

/** The type of action being carried out on an entity */
export enum Action {
  Create = 'CREATE',
  Delete = 'DELETE',
  Publish = 'PUBLISH',
  Update = 'UPDATE',
}

/** The status of the application */
export enum AppStatus {
  /** The application is experiencing issues */
  Degraded = 'DEGRADED',
  /** The application is down */
  Down = 'DOWN',
  /** The application is running normally */
  Ok = 'OK',
}

/** Audit information for changes */
export type Audit = {
  __typename?: 'Audit';
  /** The action that was performed */
  action: Action;
  /** The timestamp of the audit entry */
  timestamp: Scalars['DateTime']['output'];
  /** The user who made the change */
  user: User;
};

/** Banner element for the structure */
export type Banner = {
  __typename?: 'Banner';
  description?: Maybe<Scalars['String']['output']>;
  image: Scalars['String']['output'];
  side: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

/** Config data type */
export type Config = {
  __typename?: 'Config';
  /** The brand of the application */
  brand?: Maybe<Scalars['String']['output']>;
  /** The description of the application */
  description: Scalars['String']['output'];
  /** The keywords used in the application */
  keywords: Array<Scalars['String']['output']>;
  /** The language of the application */
  language: Scalars['String']['output'];
  /** The owner of the application */
  owner?: Maybe<Scalars['String']['output']>;
  /** The separator used in the title */
  separator: Scalars['String']['output'];
  /** The theme of the application */
  theme?: Maybe<Scalars['String']['output']>;
  /** The title of the application */
  title: Scalars['String']['output'];
};

export type Element = Banner | Md | Post | Timeline;

/** Input for each page structure element */
export type ElementInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Markdown element for the structure */
export type Md = {
  __typename?: 'MD';
  /** The content of the markdown element */
  content: Scalars['Markdown']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPage: Page;
  deletePage: Scalars['Boolean']['output'];
  updatePage: Page;
};

export type MutationCreatePageArgs = {
  input: PageInput;
};

export type MutationDeletePageArgs = {
  id: Scalars['ID']['input'];
};

export type MutationUpdatePageArgs = {
  id: Scalars['ID']['input'];
  input: PageInput;
};

/** Navigation element for the structure */
export type Navigation = {
  __typename?: 'Navigation';
  /** The priority of the navigation item */
  priority: Scalars['Int']['output'];
  /** The type of the navigation */
  type: NavigationType;
};

/** The type of navigation */
export enum NavigationType {
  /** Navigation in the footer of the application */
  Footer = 'FOOTER',
  /** Navigation in the header of the application */
  Header = 'HEADER',
}

/** The order of items */
export enum Order {
  /** Ascending order */
  Asc = 'ASC',
  /** Descending order */
  Desc = 'DESC',
}

/** Page data */
export type Page = {
  __typename?: 'Page';
  /** The UUID of the page */
  id: Scalars['ID']['output'];
  /** The meta data for the page */
  meta: PageMeta;
  /** The slug identified for the page */
  slug: Scalars['String']['output'];
  /** The structure of the page to be rendered */
  structure: Array<Maybe<Element>>;
  /** Any tags that can be used on the page as potential identifiers */
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** The page title */
  title: Scalars['String']['output'];
  /** The type of the page */
  type: PageType;
};

/** Definition of the page list including meta data */
export type PageConnection = {
  __typename?: 'PageConnection';
  /** The pagination info for the query */
  pageInfo?: Maybe<PageInfo>;
  /** A list of the pages */
  pages: Array<Page>;
  /** The total number of pages */
  totalCount: Scalars['Int']['output'];
};

/**
 * Page filtering options
 * This allows filtering by ID, slug, and tags.
 * IDs are an array of IDs, slug is a single string, and tags are an array of strings.
 * This is useful for querying specific pages based on their identifiers or attributes.
 */
export type PageFilter = {
  /** Filter by page IDs */
  id?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter by navigation type */
  navigation?: InputMaybe<NavigationType>;
  /** Filter by page slug */
  slug?: InputMaybe<Scalars['String']['input']>;
  /** Filter by page tags */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** The pagination information */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** The last element in the response list */
  endCursor: Scalars['ID']['output'];
  /** Indicator for whether there is another page */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicator for whether there is a previous page */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** The first element in the response list */
  startCursor: Scalars['ID']['output'];
};

export type PageInput = {
  meta: PageMetaInput;
  slug: Scalars['String']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
  type?: InputMaybe<PageType>;
};

/** Meta data for the page */
export type PageMeta = {
  __typename?: 'PageMeta';
  /** The audit information for the page */
  audit: Array<Audit>;
  /** The description of the page */
  description?: Maybe<Scalars['String']['output']>;
  /** The navigation items associated with the page */
  navigation?: Maybe<Array<Navigation>>;
  /** The parent page reference */
  parent?: Maybe<PageParent>;
  /** The title of the page */
  title: Scalars['String']['output'];
};

export type PageMetaInput = {
  description?: InputMaybe<Scalars['String']['input']>;
};

/** Parent page reference */
export type PageParent = {
  __typename?: 'PageParent';
  /** The ID of the parent page */
  id: Scalars['ID']['output'];
};

/** The type of the page */
export enum PageType {
  /** A blog post page */
  Blog = 'BLOG',
  /** A general page */
  Page = 'PAGE',
}

/** Post element for the structure */
export type Post = {
  __typename?: 'Post';
  /** The main content of the post */
  content: Scalars['Markdown']['output'];
  /** An excerpt of the post */
  excerpt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** The meta information for the post */
  meta: PostMeta;
  /** The slug identifier for the post */
  slug: Scalars['String']['output'];
  /** The title of the post */
  title: Scalars['String']['output'];
};

/** Post meta data */
export type PostMeta = {
  __typename?: 'PostMeta';
  /** The audit information for the post */
  audit: Array<Audit>;
};

export type Query = {
  __typename?: 'Query';
  config: Config;
  pages: PageConnection;
  status: State;
};

export type QueryPagesArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  filter?: InputMaybe<PageFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

/** State of the application */
export type State = {
  __typename?: 'State';
  /** A message about the current state */
  message: Scalars['String']['output'];
  /** The current state of the application */
  status: AppStatus;
  /** The version of the application */
  version: Scalars['String']['output'];
};

/** Timeline data */
export type Timeline = {
  __typename?: 'Timeline';
  /** The date format to use */
  dateFormat?: Maybe<Scalars['String']['output']>;
  /** The location of the date */
  dateLocation?: Maybe<Scalars['String']['output']>;
  /** The display format for the timeline */
  display?: Maybe<Scalars['String']['output']>;
  /** The events within the timeline */
  events: Array<Maybe<TimelineEvent>>;
  /** The order of the events */
  order?: Maybe<Order>;
};

/** Timeline event data */
export type TimelineEvent = {
  __typename?: 'TimelineEvent';
  /** The information in the event */
  content: Scalars['Markdown']['output'];
  /** The date of the event */
  date: Scalars['DateTime']['output'];
  /** An optional icon for the event */
  icon?: Maybe<Scalars['String']['output']>;
  /** An optional link for the event */
  link?: Maybe<Scalars['String']['output']>;
  /** An optional tag for the event */
  tag?: Maybe<Scalars['String']['output']>;
  /** The title of the event */
  title?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  /** The name of the user */
  name: Scalars['String']['output'];
  /** The user's username */
  username: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> =
  ResolversObject<{
    Element: Banner | Md | Post | Timeline;
  }>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Action: Action;
  AppStatus: AppStatus;
  Audit: ResolverTypeWrapper<Audit>;
  Banner: ResolverTypeWrapper<Banner>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Config: ResolverTypeWrapper<Config>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Element: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Element']>;
  ElementInput: ElementInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  MD: ResolverTypeWrapper<Md>;
  Markdown: ResolverTypeWrapper<Scalars['Markdown']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Navigation: ResolverTypeWrapper<Navigation>;
  NavigationType: NavigationType;
  Order: Order;
  Page: ResolverTypeWrapper<
    Omit<Page, 'structure'> & {
      structure: Array<Maybe<ResolversTypes['Element']>>;
    }
  >;
  PageConnection: ResolverTypeWrapper<
    Omit<PageConnection, 'pages'> & { pages: Array<ResolversTypes['Page']> }
  >;
  PageFilter: PageFilter;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PageInput: PageInput;
  PageMeta: ResolverTypeWrapper<PageMeta>;
  PageMetaInput: PageMetaInput;
  PageParent: ResolverTypeWrapper<PageParent>;
  PageType: PageType;
  Post: ResolverTypeWrapper<Post>;
  PostMeta: ResolverTypeWrapper<PostMeta>;
  Query: ResolverTypeWrapper<{}>;
  State: ResolverTypeWrapper<State>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Timeline: ResolverTypeWrapper<Timeline>;
  TimelineEvent: ResolverTypeWrapper<TimelineEvent>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Audit: Audit;
  Banner: Banner;
  Boolean: Scalars['Boolean']['output'];
  Config: Config;
  DateTime: Scalars['DateTime']['output'];
  Element: ResolversUnionTypes<ResolversParentTypes>['Element'];
  ElementInput: ElementInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  MD: Md;
  Markdown: Scalars['Markdown']['output'];
  Mutation: {};
  Navigation: Navigation;
  Page: Omit<Page, 'structure'> & {
    structure: Array<Maybe<ResolversParentTypes['Element']>>;
  };
  PageConnection: Omit<PageConnection, 'pages'> & {
    pages: Array<ResolversParentTypes['Page']>;
  };
  PageFilter: PageFilter;
  PageInfo: PageInfo;
  PageInput: PageInput;
  PageMeta: PageMeta;
  PageMetaInput: PageMetaInput;
  PageParent: PageParent;
  Post: Post;
  PostMeta: PostMeta;
  Query: {};
  State: State;
  String: Scalars['String']['output'];
  Timeline: Timeline;
  TimelineEvent: TimelineEvent;
  User: User;
}>;

export type AuditResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Audit'] = ResolversParentTypes['Audit'],
> = ResolversObject<{
  action?: Resolver<ResolversTypes['Action'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BannerResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Banner'] = ResolversParentTypes['Banner'],
> = ResolversObject<{
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  image?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  side?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ConfigResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Config'] = ResolversParentTypes['Config'],
> = ResolversObject<{
  brand?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  keywords?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  separator?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  theme?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type ElementResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Element'] = ResolversParentTypes['Element'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'Banner' | 'MD' | 'Post' | 'Timeline',
    ParentType,
    ContextType
  >;
}>;

export type MdResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MD'] = ResolversParentTypes['MD'],
> = ResolversObject<{
  content?: Resolver<ResolversTypes['Markdown'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface MarkdownScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Markdown'], any> {
  name: 'Markdown';
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = ResolversObject<{
  createPage?: Resolver<
    ResolversTypes['Page'],
    ParentType,
    ContextType,
    RequireFields<MutationCreatePageArgs, 'input'>
  >;
  deletePage?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationDeletePageArgs, 'id'>
  >;
  updatePage?: Resolver<
    ResolversTypes['Page'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdatePageArgs, 'id' | 'input'>
  >;
}>;

export type NavigationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Navigation'] = ResolversParentTypes['Navigation'],
> = ResolversObject<{
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NavigationType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Page'] = ResolversParentTypes['Page'],
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['PageMeta'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  structure?: Resolver<
    Array<Maybe<ResolversTypes['Element']>>,
    ParentType,
    ContextType
  >;
  tags?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['PageType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PageConnection'] = ResolversParentTypes['PageConnection'],
> = ResolversObject<{
  pageInfo?: Resolver<
    Maybe<ResolversTypes['PageInfo']>,
    ParentType,
    ContextType
  >;
  pages?: Resolver<Array<ResolversTypes['Page']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageInfoResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo'],
> = ResolversObject<{
  endCursor?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  startCursor?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageMetaResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PageMeta'] = ResolversParentTypes['PageMeta'],
> = ResolversObject<{
  audit?: Resolver<Array<ResolversTypes['Audit']>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  navigation?: Resolver<
    Maybe<Array<ResolversTypes['Navigation']>>,
    ParentType,
    ContextType
  >;
  parent?: Resolver<
    Maybe<ResolversTypes['PageParent']>,
    ParentType,
    ContextType
  >;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageParentResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PageParent'] = ResolversParentTypes['PageParent'],
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Post'] = ResolversParentTypes['Post'],
> = ResolversObject<{
  content?: Resolver<ResolversTypes['Markdown'], ParentType, ContextType>;
  excerpt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['PostMeta'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostMetaResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PostMeta'] = ResolversParentTypes['PostMeta'],
> = ResolversObject<{
  audit?: Resolver<Array<ResolversTypes['Audit']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = ResolversObject<{
  config?: Resolver<ResolversTypes['Config'], ParentType, ContextType>;
  pages?: Resolver<
    ResolversTypes['PageConnection'],
    ParentType,
    ContextType,
    Partial<QueryPagesArgs>
  >;
  status?: Resolver<ResolversTypes['State'], ParentType, ContextType>;
}>;

export type StateResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['State'] = ResolversParentTypes['State'],
> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['AppStatus'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TimelineResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Timeline'] = ResolversParentTypes['Timeline'],
> = ResolversObject<{
  dateFormat?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  dateLocation?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  display?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  events?: Resolver<
    Array<Maybe<ResolversTypes['TimelineEvent']>>,
    ParentType,
    ContextType
  >;
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TimelineEventResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TimelineEvent'] = ResolversParentTypes['TimelineEvent'],
> = ResolversObject<{
  content?: Resolver<ResolversTypes['Markdown'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Audit?: AuditResolvers<ContextType>;
  Banner?: BannerResolvers<ContextType>;
  Config?: ConfigResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Element?: ElementResolvers<ContextType>;
  MD?: MdResolvers<ContextType>;
  Markdown?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Navigation?: NavigationResolvers<ContextType>;
  Page?: PageResolvers<ContextType>;
  PageConnection?: PageConnectionResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PageMeta?: PageMetaResolvers<ContextType>;
  PageParent?: PageParentResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostMeta?: PostMetaResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  State?: StateResolvers<ContextType>;
  Timeline?: TimelineResolvers<ContextType>;
  TimelineEvent?: TimelineEventResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;
