import { GraphQLResolveInfo } from 'graphql';
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
};

/** Banner element for the structure */
export type Banner = {
  __typename?: 'Banner';
  description?: Maybe<Scalars['String']['output']>;
  image: Scalars['String']['output'];
  side: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Element = Banner | Markdown;

/** Markdown element for the structure */
export type Markdown = {
  __typename?: 'Markdown';
  /**  The content of the markdown element  */
  content: Scalars['String']['output'];
};

/** Page data */
export type Page = {
  __typename?: 'Page';
  /**  The UUID of the page  */
  id: Scalars['ID']['output'];
  /**  The slug identified for the page  */
  slug: Scalars['String']['output'];
  /**  The structure of the page to be rendered  */
  structure: Array<Maybe<Element>>;
  /**  Any tags that can be used on the page as potential identifiers  */
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /**  The page title  */
  title: Scalars['String']['output'];
};

/**
 * Page filtering options
 * This allows filtering by ID, slug, and tags.
 * IDs are an array of IDs, slug is a single string, and tags are an array of strings.
 * This is useful for querying specific pages based on their identifiers or attributes.
 */
export type PageFilter = {
  /**  Filter by page IDs  */
  id?: InputMaybe<Array<Scalars['ID']['input']>>;
  /**  Filter by page slug  */
  slug?: InputMaybe<Scalars['String']['input']>;
  /**  Filter by page tags  */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Query = {
  __typename?: 'Query';
  pages: Array<Page>;
};


export type QueryPagesArgs = {
  filter?: InputMaybe<PageFilter>;
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
  Element: ( Banner ) | ( Markdown );
}>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Banner: ResolverTypeWrapper<Banner>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Element: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Element']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Markdown: ResolverTypeWrapper<Markdown>;
  Page: ResolverTypeWrapper<Omit<Page, 'structure'> & { structure: Array<Maybe<ResolversTypes['Element']>> }>;
  PageFilter: PageFilter;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Banner: Banner;
  Boolean: Scalars['Boolean']['output'];
  Element: ResolversUnionTypes<ResolversParentTypes>['Element'];
  ID: Scalars['ID']['output'];
  Markdown: Markdown;
  Page: Omit<Page, 'structure'> & { structure: Array<Maybe<ResolversParentTypes['Element']>> };
  PageFilter: PageFilter;
  Query: {};
  String: Scalars['String']['output'];
}>;

export type BannerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Banner'] = ResolversParentTypes['Banner']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  image?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  side?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ElementResolvers<ContextType = any, ParentType extends ResolversParentTypes['Element'] = ResolversParentTypes['Element']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Banner' | 'Markdown', ParentType, ContextType>;
}>;

export type MarkdownResolvers<ContextType = any, ParentType extends ResolversParentTypes['Markdown'] = ResolversParentTypes['Markdown']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

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

export type Resolvers<ContextType = any> = ResolversObject<{
  Banner?: BannerResolvers<ContextType>;
  Element?: ElementResolvers<ContextType>;
  Markdown?: MarkdownResolvers<ContextType>;
  Page?: PageResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

