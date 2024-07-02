import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader } from '../../../../../../components';
import { ChatsAndFriendsContext } from '../../../../../../contexts';
import { DashboardStyled } from './Dashboard.styled';

const Dashboard = ({ isLoading, navbarHeight }: any) => {
  const {
    chatLoading,
    chatsLoading,
    chatsCalled,
    otherFriendsLoading,
    otherFriendsCalled,
  } = useContext(ChatsAndFriendsContext);

  if (
    isLoading ||
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
    <DashboardStyled navbarHeight={navbarHeight}>
      <Outlet context={[navbarHeight]} />
    </DashboardStyled>
  );
};

export default Dashboard;
