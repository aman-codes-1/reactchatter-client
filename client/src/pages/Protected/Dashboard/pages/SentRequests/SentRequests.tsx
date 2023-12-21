import { useContext, useLayoutEffect, useState } from 'react';
import {
  FriendRequest as FriendRequestComp,
  MainLayout,
} from '../../components';
import { useAuth } from '../../../../../hooks';
import { FriendRequest } from '../../../../../libs';
import { SnackbarContext } from '../../../../../contexts';

const SentRequests = () => {
  const friendRequest = new FriendRequest();
  const [state, setState] = useState<any>({
    loading: true,
    data: [],
    error: '',
  });
  const { data, error, loading } = state;
  const [refetch, setRefetch] = useState(false);
  const { auth: { _id = '' } = {} } = useAuth();
  const { openSnackbar } = useContext(SnackbarContext);

  useLayoutEffect(() => {
    const fetchSentFriendRequests = async () => {
      setState((prev: any) => ({
        ...prev,
        error: '',
      }));
      try {
        const { data: Data }: any = await friendRequest.sentFriendRequests({
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
    fetchSentFriendRequests();
  }, [refetch]);

  const refetchSentRequests = () => {
    setRefetch((prev) => !prev);
  };

  const handleClickCancelRequest = async (_: any, idx: any) => {
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
        status: 'cancelled',
      });
      refetchSentRequests();
    } catch (err: any) {
      refetchSentRequests();
      openSnackbar({ message: err?.response?.data?.message, type: 'error' });
    }
  };

  return (
    <MainLayout
      heading="Sent Requests"
      defaultText="You have not sent any friend requests."
      loading={loading}
      data={data}
      error={error}
    >
      <FriendRequestComp
        loading={loading}
        data={data}
        error={error}
        userObj="sentToUser"
        emailKey="email"
        cancelBtnProps={{
          handleClickCancel: handleClickCancelRequest,
        }}
      />
    </MainLayout>
  );
};

export default SentRequests;
