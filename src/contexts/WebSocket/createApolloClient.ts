import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';

export const createApolloClient = (auth: any) => {
  const httpLink = new HttpLink({
    uri: `${process.env.REACT_APP_BACKEND_URI || 'http://localhost:8000'}/graphql`,
  });

  const wsLink = new WebSocketLink(
    new SubscriptionClient(process.env.REACT_APP_GRAPHQL_URI || 'wss://localhost:8000/graphql', {
      reconnect: true,
      lazy: true,
    }),
  );

  // const wsLink = new GraphQLWsLink(
  //   createClient({
  //     url: process.env.REACT_APP_GRAPHQL_URI || 'wss://localhost:8000/graphql',
  //     lazy: true,
  //   }),
  // );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
      addTypename: false,
    }),
  });

  return { client, auth };
};
