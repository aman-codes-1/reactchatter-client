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
        avatarWidth: 24,
        avatarHeight: 24,
        disablePrimary: true,
        btnHeight: '4rem',
      }}
      error={sentRequestsError?.graphQLErrors?.[0]?.message}
      data={sentRequests}
    >
      <FriendRequest
        data={sentRequests}
        userObj="memberDetails"
        emailKey="email"
        cancelBtnProps={{
          handleClickCancel: updateRequestLoading
            ? () => {}
            : (_: MouseEventHandler, __: number, ___: any) =>
                handleClickRequest(_, __, ___, 'cancelled'),
        }}
      />
    </MainLayout>
  );
};

export default SentRequests;
