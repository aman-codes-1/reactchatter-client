import { MouseEventHandler, useContext } from 'react';
import { FriendRequest } from '../../../components';
import { useAuth, useSnackbar } from '../../../hooks';
import { ChatsAndFriendsContext } from '../../../contexts';

const FriendRequests = () => {
  const { openSnackbar } = useSnackbar();
  const {
    pendingRequests = [],
    pendingRequestsLoading,
    pendingRequestsError,
    updateRequest,
  } = useContext(ChatsAndFriendsContext);
  const { auth: { _id = '' } = {} } = useAuth();

  const handleClickRequest = async (
    _: MouseEventHandler,
    __: number,
    request: any,
    status: string,
  ) => {
    try {
      await updateRequest({
        variables: {
          userId: _id,
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
    <FriendRequest
      mainLayoutProps={{
        heading: 'Friend Requests',
        defaultText: "You haven't received any friend requests.",
        loading: pendingRequestsLoading,
        error: pendingRequestsError?.graphQLErrors?.[0]?.message,
      }}
      data={pendingRequests}
      nameKey="name"
      emailKey="email"
      pictureKey="picture"
      confirmBtnProps={{
        onClick: (_: MouseEventHandler, __: number, ___: any) =>
          handleClickRequest(_, __, ___, 'accepted'),
      }}
      deleteBtnProps={{
        onClick: (_: MouseEventHandler, __: number, ___: any) =>
          handleClickRequest(_, __, ___, 'rejected'),
      }}
    />
  );
};

export default FriendRequests;
