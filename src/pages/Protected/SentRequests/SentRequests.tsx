import { MouseEventHandler, useContext } from 'react';
import { FriendRequest, MainLayout } from '..';
import { useSnackbar } from '../../../hooks';
import { ChatsAndFriendsContext } from '../../../contexts';

const SentRequests = () => {
  const { openSnackbar } = useSnackbar();
  const {
    updateRequest,
    updateRequestLoading,
    sentRequests,
    sentRequestsLoading,
    sentRequestsCalled,
    sentRequestsError,
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
      heading="Sent Requests"
      defaultText="You have not sent any friend requests."
      loading={sentRequestsLoading || !sentRequestsCalled}
      loaderProps={{
        avatarWidth: 61,
        avatarHeight: 61,
        secondaryFontSize: '0.975rem',
        btnHeight: '6.5rem',
        sx: { gap: '1.2rem' },
      }}
      error={sentRequestsError?.graphQLErrors?.[0]?.message}
      data={sentRequests}
    >
      <FriendRequest
        data={sentRequests}
        userObj="memberDetails"
        nameKey="name"
        emailKey="email"
        pictureKey="picture"
        deleteBtnProps={{
          handleClickDelete: updateRequestLoading
            ? () => {}
            : (_: MouseEventHandler, __: number, ___: any) =>
                handleClickRequest(_, __, ___, 'cancelled'),
        }}
      />
    </MainLayout>
  );
};

export default SentRequests;
