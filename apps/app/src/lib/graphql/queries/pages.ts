import { gql } from '@apollo/client';

export const GET_SITE_MAP = gql`
  query pages {
    pages {
      pages {
        id
        meta {
          audit {
            action
            timestamp
          }
          parent {
            id
          }
          navigation {
            priority
            type
          }
        }
        slug
        title
      }
    }
  }
`;

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
          }
          ... on Banner {
            description
            image
            side
            title
          }
          ... on Post {
            content
            excerpt
            id
            meta {
              audit {
                action
                timestamp
                user {
                  name
                }
              }
            }
            slug
            title
          }
          ... on Timeline {
            dateFormat
            dateLocation
            display
            items: events {
              content
              date
              icon
              link
              tag
              title
            }
            order
          }
          type: __typename
        }
        tags
        title
        type
      }
      totalCount
    }
  }
`;
