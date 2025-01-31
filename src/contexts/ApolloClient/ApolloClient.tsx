import { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApi, useAuth } from '../../hooks';
import { createApolloClient } from './createApolloClient';

export const ApolloClientProvider = ({ children }: any) => {
  const { auth, setIsWsConnected } = useAuth();
  const { callLogout } = useApi();

  const client: any = useMemo(
    () => createApolloClient(callLogout, setIsWsConnected),
    [auth?.isLoggedIn],
  );

  if (!client) {
    return children;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
