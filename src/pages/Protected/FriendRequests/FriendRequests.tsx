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
      loaderProps={{
        avatarWidth: 61,
        avatarHeight: 61,
        secondaryFontSize: '0.975rem',
        btnHeight: '6.5rem',
        sx: { gap: '1.2rem' },
      }}
      error={pendingRequestsError?.graphQLErrors?.[0]?.message}
      data={pendingRequests}
    >
      <FriendRequest
        data={pendingRequests}
        userObj="memberDetails"
        nameKey="name"
        emailKey="email"
        pictureKey="picture"
        confirmBtnProps={{
          handleClickConfirm: (_: MouseEventHandler, __: number, ___: any) =>
            handleClickRequest(_, __, ___, 'accepted'),
        }}
        deleteBtnProps={{
          handleClickDelete: (_: MouseEventHandler, __: number, ___: any) =>
            handleClickRequest(_, __, ___, 'rejected'),
        }}
      />
    </MainLayout>
  );
};

export default FriendRequests;
