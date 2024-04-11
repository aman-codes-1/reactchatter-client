import { MouseEventHandler, useLayoutEffect } from 'react';
import { FriendRequest as FriendRequestComp, MainLayout } from '..';
import {
  SENT_REQUESTS_QUERY,
  useAuth,
  useRequests,
  useSnackbar,
} from '../../../hooks';

const SentRequests = () => {
  const { auth: { _id = '' } = {} } = useAuth();
  const { openSnackbar } = useSnackbar();
  const {
    getSentRequests,
    updateRequest,
    sentRequestsData: data,
    sentRequestsLoading: loading,
    sentRequestsError: error,
    sentRequestsClient,
  } = useRequests();

  useLayoutEffect(() => {
    getSentRequests({
      variables: {
        sentByUserId: _id,
      },
    });
  }, [_id, getSentRequests]);

  const handleClickCancelRequest = async (
    _: MouseEventHandler,
    idx: number,
    status: string,
  ) => {
    try {
      const dataCopy = [...data];
      dataCopy.splice(idx, 1);
      sentRequestsClient.writeQuery({
        query: SENT_REQUESTS_QUERY,
        data: {
          sentRequests: dataCopy,
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
      sentRequestsClient.writeQuery({
        query: SENT_REQUESTS_QUERY,
        data: {
          sentRequests: data,
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
      heading="Sent Requests"
      defaultText="You have not sent any friend requests."
      loading={loading}
      data={data}
      error={error?.graphQLErrors?.[0]?.message}
    >
      <FriendRequestComp
        loading={loading}
        data={data}
        error={error?.graphQLErrors?.[0]?.message}
        userObj="userDetails"
        emailKey="email"
        cancelBtnProps={{
          handleClickCancel: (_: MouseEventHandler, __: number) =>
            handleClickCancelRequest(_, __, 'cancelled'),
        }}
      />
    </MainLayout>
  );
};

export default SentRequests;
