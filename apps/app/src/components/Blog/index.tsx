'use client';
import { Post } from '@content/graph/generated/types';
import { BlogList } from '@nick8green/components';
import { FC } from 'react';

export type BlogProps = {
  params?: { [key: string]: string | string[] | undefined };
  posts: Post[];
  slug: string[];
  title: string;
};

const Blog: FC<BlogProps> = ({ posts, title }) => (
  <>
    <h2>{title}</h2>
    <BlogList posts={posts} />
  </>
);

export default Blog;
