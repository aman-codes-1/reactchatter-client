import { useEffect } from 'react';
import { MainLayout } from '../../components';
import { useAuth } from '../../../../../hooks';
import { FriendRequest } from '../../../../../libs';

const SentRequests = () => {
  const sentFriendRequests = new FriendRequest();
  const { auth: { _id = '' } = {} } = useAuth();

  useEffect(() => {
    const fetchSentFriendRequests = async () => {
      try {
        await sentFriendRequests.sentFriendRequests({ sentByUserId: _id });
      } catch (err) {
        console.log(err);
      }
    };
    fetchSentFriendRequests();
  }, []);

  return (
    <MainLayout
      heading="Sent Requests"
      defaultText="You have not sent any friend requests."
    />
  );
};

export default SentRequests;
