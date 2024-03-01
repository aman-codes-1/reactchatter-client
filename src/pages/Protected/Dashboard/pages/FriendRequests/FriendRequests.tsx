import { useContext, useLayoutEffect, useState } from 'react';
import {
  FriendRequest as FriendRequestComp,
  MainLayout,
} from '../../components';
import { FriendRequest } from '../../../../../libs';
import { useAuth } from '../../../../../hooks';
import { FriendsContext, SnackbarContext } from '../../../../../contexts';

const FriendRequests = () => {
  const friendRequest = new FriendRequest();
  const [state, setState] = useState<any>({
    loading: true,
    data: [],
    error: '',
  });
  const { data, error, loading } = state;
  const [refetch, setRefetch] = useState(false);
  const { auth: { _id = '' } = {} } = useAuth();
  const { refetchFriends } = useContext(FriendsContext);
  const { openSnackbar } = useContext(SnackbarContext);

  useLayoutEffect(() => {
    const fetchReceivedFriendRequests = async () => {
      setState((prev: any) => ({
        ...prev,
        error: '',
      }));
      try {
        const { data: Data }: any = await friendRequest.receivedFriendRequests({
          sentByUserId: _id,
        });
        setState({
          loading: false,
          data: Data && Data?.data?.length ? Data?.data : [],
          error: '',
        });
      } catch (err: any) {
        setState({
          loading: false,
          data: [],
          error: err?.response?.data?.message,
        });
      }
    };
    fetchReceivedFriendRequests();
  }, [refetch]);

  const refetchReceivedRequests = () => {
    setRefetch((prev) => !prev);
  };

  const handleClickAcceptRequest = async (_: any, idx: any) => {
    try {
      const dataCopy = [...data];
      dataCopy.splice(idx, 1);
      setState((prev: any) => ({
        ...prev,
        data: dataCopy,
      }));
      const requestId = data?.[idx]?._id;
      await friendRequest.respondToFriendRequest({
        requestId,
        status: 'accepted',
      });
      refetchReceivedRequests();
      refetchFriends();
    } catch (err: any) {
      refetchReceivedRequests();
      openSnackbar({ message: err?.response?.data?.message, type: 'error' });
    }
  };

  const handleClickRejectRequest = async (_: any, idx: any) => {
    try {
      const dataCopy = [...data];
      dataCopy.splice(idx, 1);
      setState((prev: any) => ({
        ...prev,
        data: dataCopy,
      }));
      const requestId = data?.[idx]?._id;
      await friendRequest.respondToFriendRequest({
        requestId,
        status: 'rejected',
      });
      refetchReceivedRequests();
    } catch (err: any) {
      refetchReceivedRequests();
      openSnackbar({ message: err?.response?.data?.message, type: 'error' });
    }
  };

  return (
    <MainLayout
      heading="Friend Requests"
      defaultText="You have no friend requests."
      loading={loading}
      data={data}
      error={error}
    >
      <FriendRequestComp
        loading={loading}
        data={data}
        error={error}
        userObj="receivedByUser"
        emailKey="email"
        acceptBtnProps={{
          handleClickAccept: handleClickAcceptRequest,
        }}
        cancelBtnProps={{
          handleClickCancel: handleClickRejectRequest,
        }}
      />
    </MainLayout>
  );
};

export default FriendRequests;
