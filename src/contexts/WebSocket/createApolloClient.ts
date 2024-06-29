import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { ErrorResponse, onError } from '@apollo/client/link/error';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { getMainDefinition } from '@apollo/client/utilities';
import { RetryLink } from '@apollo/client/link/retry';

export const createApolloClient = (auth: any, callLogout: any) => {
  const uri = `${process.env.REACT_APP_PROXY_URI}`;

  const graphqlUri = `${uri}/graphql`;

  const subscriptionUri = `${uri?.replace?.('http', 'ws')}/subscriptions`;

  const wsLink = new GraphQLWsLink(
    createClient({
      url: subscriptionUri,
    }),
  );

  const httpLink = new HttpLink({
    uri: graphqlUri,
    credentials: 'include',
  });

  const errorLink: ApolloLink = onError(
    ({ graphQLErrors, networkError }: ErrorResponse) => {
      if (graphQLErrors) {
        graphQLErrors.map(async ({ extensions }: GraphQLError) => {
          if (extensions?.code === 'UNAUTHENTICATED') {
            await callLogout();
          }
          return true;
        });
      }

      if (networkError) {
        //
      }
    },
  );

  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: 20000,
      jitter: true,
    },
    attempts: {
      max: 3,
      retryIf: (error: any) => !!error,
    },
  });

  const opsLink: ApolloLink = from([errorLink, retryLink, httpLink]);

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    opsLink,
  );

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
      addTypename: false,
    }),
  });

  return { client, auth };
};
