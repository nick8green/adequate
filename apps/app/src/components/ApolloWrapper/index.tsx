'use client';

import { ApolloNextAppProvider } from '@apollo/client-integration-nextjs';
import { getBrowserClient } from '@app/lib/graphql/client';
import type { FC, PropsWithChildren } from 'react';

const ApolloWrapper: FC<PropsWithChildren> = ({ children }) => (
  <ApolloNextAppProvider makeClient={getBrowserClient}>
    {children}
  </ApolloNextAppProvider>
);

export default ApolloWrapper;
