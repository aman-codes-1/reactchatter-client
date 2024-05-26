import { MouseEventHandler, useContext } from 'react';
import { FriendRequest, MainLayout } from '..';
import { useSnackbar } from '../../../hooks';
import { ChatsAndFriendsContext } from '../../../contexts';

const FriendRequests = () => {
  const { openSnackbar } = useSnackbar();
  const {
    updateRequest,
    pendingRequests,
    pendingRequestsLoading,
    pendingRequestsCalled,
    pendingRequestsError,
  } = useContext(ChatsAndFriendsContext);

  const handleClickRequest = async (
    _: MouseEventHandler,
    __: number,
    request: any,
    status: string,
  ) => {
    try {
      await updateRequest({
        variables: {
          requestId: request?._id,
          status,
        },
      });
    } catch (err: any) {
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
      loading={pendingRequestsLoading || !pendingRequestsCalled}
      data={pendingRequests}
      error={pendingRequestsError?.graphQLErrors?.[0]?.message}
    >
      <FriendRequest
        loading={pendingRequestsLoading || !pendingRequestsCalled}
        data={pendingRequests}
        error={pendingRequestsError?.graphQLErrors?.[0]?.message}
        userObj="memberDetails"
        emailKey="email"
        acceptBtnProps={{
          handleClickAccept: (_: MouseEventHandler, __: number, ___: any) =>
            handleClickRequest(_, __, ___, 'accepted'),
        }}
        cancelBtnProps={{
          handleClickCancel: (_: MouseEventHandler, __: number, ___: any) =>
            handleClickRequest(_, __, ___, 'rejected'),
        }}
      />
    </MainLayout>
  );
};

export default FriendRequests;
