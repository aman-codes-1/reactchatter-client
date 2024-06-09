import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader } from '../../../../../../components';
import { ChatsAndFriendsContext } from '../../../../../../contexts';
import { useSocket } from '../../../../../../hooks';
import { DashboardStyled } from './Dashboard.styled';

const Dashboard = ({ isLoading }: any) => {
  const {
    chatLoading,
    chatsLoading,
    chatsCalled,
    otherFriendsLoading,
    otherFriendsCalled,
  } = useContext(ChatsAndFriendsContext);
  const { socket } = useSocket();

  if (
    isLoading ||
    !socket ||
    chatLoading ||
    !chatsCalled ||
    chatsLoading ||
    otherFriendsLoading ||
    !otherFriendsCalled
    // pendingRequestsLoading ||
    // sentRequestsLoading
  ) {
    return <Loader center />;
  }

  return (
    <DashboardStyled>
      <Outlet />
    </DashboardStyled>
  );
};

export default Dashboard;
