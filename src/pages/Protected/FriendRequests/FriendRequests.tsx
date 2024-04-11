import { MouseEventHandler, useLayoutEffect } from 'react';
import { FriendRequest, MainLayout } from '..';
import {
  FRIEND_REQUESTS_QUERY,
  useAuth,
  useRequests,
  useSnackbar,
} from '../../../hooks';

const FriendRequests = () => {
  const { auth: { _id = '' } = {} } = useAuth();
  const { openSnackbar } = useSnackbar();
  const {
    getRequests,
    updateRequest,
    requestsData: data,
    requestsLoading: loading,
    requestsError: error,
    requestsClient,
  } = useRequests();

  useLayoutEffect(() => {
    getRequests({
      variables: {
        sentByUserId: _id,
      },
    });
  }, [_id, getRequests]);

  const handleClickRequest = async (
    _: MouseEventHandler,
    idx: number,
    status: string,
  ) => {
    try {
      const dataCopy = [...data];
      dataCopy.splice(idx, 1);
      requestsClient.writeQuery({
        query: FRIEND_REQUESTS_QUERY,
        data: {
          requests: dataCopy,
        },
        variables: {
          sentByUserId: _id,
        },
      });
      const requestId = data?.[idx]?._id;
      await updateRequest({
        variables: {
          requestId,
          status,
        },
      });
    } catch (err: any) {
      requestsClient.writeQuery({
        query: FRIEND_REQUESTS_QUERY,
        data: {
          requests: data,
        },
        variables: {
          sentByUserId: _id,
        },
      });
      openSnackbar({
        message: err?.graphQLErrors?.[0]?.message,
        type: 'error',
      });
    }
  };

  return (
    <MainLayout
      heading="Friend Requests"
      defaultText="You have no friend requests."
      loading={loading}
      data={data}
      error={error?.graphQLErrors?.[0]?.message}
    >
      <FriendRequest
        loading={loading}
        data={data}
        error={error?.graphQLErrors?.[0]?.message}
        userObj="userDetails"
        emailKey="email"
        acceptBtnProps={{
          handleClickAccept: (_: MouseEventHandler, __: number) =>
            handleClickRequest(_, __, 'accepted'),
        }}
        cancelBtnProps={{
          handleClickCancel: (_: MouseEventHandler, __: number) =>
            handleClickRequest(_, __, 'rejected'),
        }}
      />
    </MainLayout>
  );
};

export default FriendRequests;
