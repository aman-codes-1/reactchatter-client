import { useLazyQuery, useMutation } from '@apollo/client';
import {
  CREATE_REQUEST_MUTATION,
  FRIEND_REQUESTS_QUERY,
  SENT_REQUESTS_QUERY,
  UPDATE_REQUEST_MUTATION,
} from './gql';

export const useRequests = () => {
  const [
    getRequests,
    {
      loading: requestsLoading,
      data: { requests: requestsData = [] } = {},
      error: requestsError,
      client: requestsClient,
    },
  ] = useLazyQuery(FRIEND_REQUESTS_QUERY);

  const [
    getSentRequests,
    {
      loading: sentRequestsLoading,
      data: { sentRequests: sentRequestsData = [] } = {},
      error: sentRequestsError,
      client: sentRequestsClient,
    },
  ] = useLazyQuery(SENT_REQUESTS_QUERY);

  const [createRequest, { loading: createRequestLoading }] = useMutation(
    CREATE_REQUEST_MUTATION,
  );

  const [updateRequest] = useMutation(UPDATE_REQUEST_MUTATION);

  return {
    getRequests,
    getSentRequests,
    createRequest,
    updateRequest,
    requestsData,
    sentRequestsData,
    requestsLoading,
    sentRequestsLoading,
    createRequestLoading,
    requestsError,
    sentRequestsError,
    requestsClient,
    sentRequestsClient,
  };
};
