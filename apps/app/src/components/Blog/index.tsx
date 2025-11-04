'use client';
import { useQuery } from '@apollo/client/react';
import { GET_BLOG_POSTS } from '@app/lib/graphql/queries/blog';
// import { Post } from '@content/graph/generated/types';
// import { BlogList } from '@nick8green/components';
import { FC } from 'react';

export type BlogProps = {
  slug: string;
  title: string;
};

const Blog: FC<BlogProps> = ({ slug, title }) => {
  const { loading, error, data } = useQuery(GET_BLOG_POSTS);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    throw new Error(error.message);
  }

  return (
    <>
      <h2>{title}</h2>
      <p>Welcome to the blog!</p>
      <p>{slug}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {/* <BlogList posts={[]} /> */}
    </>
  );
};

export default Blog;
