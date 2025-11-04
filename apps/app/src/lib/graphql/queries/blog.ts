import { gql } from '@apollo/client';

export const GET_BLOG_POSTS = gql`
  query blogPosts {
    posts {
      id
      title
      excerpt
      content
      slug
      meta {
        audit {
          action
          timestamp
        }
        author {
          id
          name
        }
      }
    }
  }
`;
