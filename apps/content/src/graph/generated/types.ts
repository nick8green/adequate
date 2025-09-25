import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Markdown: { input: any; output: any; }
};

/** Banner element for the structure */
export type Banner = {
  __typename?: 'Banner';
  description?: Maybe<Scalars['String']['output']>;
  image: Scalars['String']['output'];
  side: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Element = Banner | Md | Timeline;

/** Markdown element for the structure */
export type Md = {
  __typename?: 'MD';
  /** The content of the markdown element */
  content: Scalars['Markdown']['output'];
};

/** Page data */
export type Page = {
  __typename?: 'Page';
  /** The UUID of the page */
  id: Scalars['ID']['output'];
  /** The slug identified for the page */
  slug: Scalars['String']['output'];
  /** The structure of the page to be rendered */
  structure: Array<Maybe<Element>>;
  /** Any tags that can be used on the page as potential identifiers */
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** The page title */
  title: Scalars['String']['output'];
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
  /** Filter by page slug */
  slug?: InputMaybe<Scalars['String']['input']>;
  /** Filter by page tags */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Query = {
  __typename?: 'Query';
  pages: Array<Page>;
};


export type QueryPagesArgs = {
  filter?: InputMaybe<PageFilter>;
};

/** Timeline data */
export type Timeline = {
  __typename?: 'Timeline';
  /** The events within the timeline */
  events: Array<TimelineEvent>;
  /** The UUID of the timeline */
  id: Scalars['ID']['output'];
  /** The name of the timeline */
  name: Scalars['String']['output'];
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
  /** The UUID of the event */
  id: Scalars['ID']['output'];
  /** An optional link for the event */
  link?: Maybe<Scalars['String']['output']>;
  /** An optional tag for the event */
  tag?: Maybe<Scalars['String']['output']>;
  /** The title of the event */
  title: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  Element: ( Banner ) | ( Md ) | ( Timeline );
}>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Banner: ResolverTypeWrapper<Banner>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Element: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Element']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  MD: ResolverTypeWrapper<Md>;
  Markdown: ResolverTypeWrapper<Scalars['Markdown']['output']>;
  Page: ResolverTypeWrapper<Omit<Page, 'structure'> & { structure: Array<Maybe<ResolversTypes['Element']>> }>;
  PageFilter: PageFilter;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Timeline: ResolverTypeWrapper<Timeline>;
  TimelineEvent: ResolverTypeWrapper<TimelineEvent>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Banner: Banner;
  Boolean: Scalars['Boolean']['output'];
  DateTime: Scalars['DateTime']['output'];
  Element: ResolversUnionTypes<ResolversParentTypes>['Element'];
  ID: Scalars['ID']['output'];
  MD: Md;
  Markdown: Scalars['Markdown']['output'];
  Page: Omit<Page, 'structure'> & { structure: Array<Maybe<ResolversParentTypes['Element']>> };
  PageFilter: PageFilter;
  Query: {};
  String: Scalars['String']['output'];
  Timeline: Timeline;
  TimelineEvent: TimelineEvent;
}>;

export type BannerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Banner'] = ResolversParentTypes['Banner']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  image?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  side?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type ElementResolvers<ContextType = any, ParentType extends ResolversParentTypes['Element'] = ResolversParentTypes['Element']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Banner' | 'MD' | 'Timeline', ParentType, ContextType>;
}>;

export type MdResolvers<ContextType = any, ParentType extends ResolversParentTypes['MD'] = ResolversParentTypes['MD']> = ResolversObject<{
  content?: Resolver<ResolversTypes['Markdown'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface MarkdownScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Markdown'], any> {
  name: 'Markdown';
}

export type PageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  structure?: Resolver<Array<Maybe<ResolversTypes['Element']>>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  pages?: Resolver<Array<ResolversTypes['Page']>, ParentType, ContextType, Partial<QueryPagesArgs>>;
}>;

export type TimelineResolvers<ContextType = any, ParentType extends ResolversParentTypes['Timeline'] = ResolversParentTypes['Timeline']> = ResolversObject<{
  events?: Resolver<Array<ResolversTypes['TimelineEvent']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TimelineEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimelineEvent'] = ResolversParentTypes['TimelineEvent']> = ResolversObject<{
  content?: Resolver<ResolversTypes['Markdown'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Banner?: BannerResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Element?: ElementResolvers<ContextType>;
  MD?: MdResolvers<ContextType>;
  Markdown?: GraphQLScalarType;
  Page?: PageResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Timeline?: TimelineResolvers<ContextType>;
  TimelineEvent?: TimelineEventResolvers<ContextType>;
}>;

