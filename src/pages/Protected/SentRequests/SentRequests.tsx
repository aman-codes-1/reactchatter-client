import { MouseEventHandler, useContext } from 'react';
import { useAuth, useSnackbar } from '../../../hooks';
import { ChatsAndFriendsContext } from '../../../contexts';
import { FriendRequest } from '../components';

const SentRequests = () => {
  const { openSnackbar } = useSnackbar();
  const {
    sentRequests = [],
    sentRequestsLoading,
    sentRequestsError,
    updateRequest,
    updateRequestLoading,
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
        heading: 'Sent Requests',
        defaultText: "You haven't sent any friend requests.",
        loading: sentRequestsLoading,
        error: sentRequestsError?.graphQLErrors?.[0]?.message,
      }}
      data={sentRequests}
      nameKey="name"
      emailKey="email"
      pictureKey="picture"
      deleteBtnProps={{
        onClick: updateRequestLoading
          ? () => {}
          : (_: MouseEventHandler, __: number, ___: any) =>
              handleClickRequest(_, __, ___, 'cancelled'),
      }}
    />
  );
};

export default SentRequests;
