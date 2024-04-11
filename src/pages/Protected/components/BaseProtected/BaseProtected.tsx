import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { NavBar } from '../../../../components';
import { ChatsAndFriendsProvider } from '../../../../contexts';
import { SideBar } from './components';
import { BaseProtectedStyled, DashboardStyled } from './BaseProtected.styled';

const BaseProtected = () => {
  const { pathname } = useLocation();

  return (
    <ChatsAndFriendsProvider>
      <BaseProtectedStyled>
        <Box className="base-protected-container">
          <SideBar />
          <NavBar className="navbar" />
          <DashboardStyled disablePadding={pathname?.includes?.('chat')}>
            <Outlet />
          </DashboardStyled>
        </Box>
      </BaseProtectedStyled>
    </ChatsAndFriendsProvider>
  );
};

export default BaseProtected;
