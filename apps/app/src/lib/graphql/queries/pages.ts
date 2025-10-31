import { gql } from '@apollo/client';

export const GET_PAGE_BY_SLUG = gql`
  query pages($slug: String!) {
    pages(filter: { slug: $slug }) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      pages {
        id
        meta {
          title
          description
        }
        slug
        structure {
          ... on MD {
            content
            type: __typename
          }
          ... on Banner {
            description
            image
            side
            title
            type: __typename
          }
        }
        tags
        title
        type
      }
      totalCount
    }
  }
`;
