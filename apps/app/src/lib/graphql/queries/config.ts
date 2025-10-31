import { gql } from '@apollo/client';

export const GET_CONFIG = gql`
fragment pages on PageConnection {
  totalCount
  pages {
    id
    url: slug
    label: title
    meta {
      parent {
        id
      }
      navigation {
        priority
        type
      }
    }
  }
}

query config {
  config {
    title
    description
    keywords
    separator
    owner
    brand
    theme
    language
  }
  header: pages(filter: { navigation: HEADER }) {
    ...pages
  }
  footer: pages(filter: { navigation: FOOTER }) {
    ...pages
  }
}
`;
