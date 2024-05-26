import { MouseEventHandler, useContext } from 'react';
import { FriendRequest as FriendRequestComp, MainLayout } from '..';
import { useSnackbar } from '../../../hooks';
import { ChatsAndFriendsContext } from '../../../contexts';

const SentRequests = () => {
  const { openSnackbar } = useSnackbar();
  const {
    updateRequest,
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
      data={sentRequests}
      error={sentRequestsError?.graphQLErrors?.[0]?.message}
    >
      <FriendRequestComp
        loading={sentRequestsLoading || !sentRequestsCalled}
        data={sentRequests}
        error={sentRequestsError?.graphQLErrors?.[0]?.message}
        userObj="memberDetails"
        emailKey="email"
        cancelBtnProps={{
          handleClickCancel: (_: MouseEventHandler, __: number, ___: any) =>
            handleClickRequest(_, __, ___, 'cancelled'),
        }}
      />
    </MainLayout>
  );
};

export default SentRequests;
