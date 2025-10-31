import { gql } from '@apollo/client';

export const GET_CONFIG = gql`
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
  }
`;
