import { createContext, useMemo, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApi, useAuth } from '../../hooks';
import { createApolloClient } from './createApolloClient';

export const ApolloClientContext = createContext<any>({});

export const ApolloClientProvider = ({ children }: any) => {
  const [isWsConnected, setIsWsConnected] = useState(false);
  const { auth } = useAuth();
  const { callLogout } = useApi();

  const client: any = useMemo(
    () => createApolloClient(callLogout, setIsWsConnected),
    [auth?.isLoggedIn],
  );

  return (
    <ApolloClientContext.Provider
      value={{
        isWsConnected,
        setIsWsConnected,
      }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ApolloClientContext.Provider>
  );
};
