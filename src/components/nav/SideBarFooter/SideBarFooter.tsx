import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { CircularProgress, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { UserProfile } from '../..';
import { Authentication } from '../../../libs';
import { useAuth, useSocket } from '../../../hooks';
import { SideBarFooterStyled } from './SideBarFooter.styled';

const SideBarFooter = ({ sx }: any) => {
  const authentication = new Authentication();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { auth: { name = '', email = '', picture = '' } = {}, setAuth } =
    useAuth();
  const { socket } = useSocket();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      googleLogout();
      await authentication.logout();
    } catch (err: any) {
      //
    } finally {
      localStorage.removeItem('isAuthenticated');
      setAuth(undefined);
      navigate('/', { replace: true });
      if (socket) {
        socket.disconnect();
      }
      setIsLoading(false);
    }
  };

  return (
    <SideBarFooterStyled sx={sx}>
      <UserProfile
        name={name}
        email={email}
        picture={picture}
        disableHover
        secondaryAction={
          <IconButton className="logout-btn" edge="end" onClick={handleLogout}>
            {isLoading ? (
              <CircularProgress size={18} />
            ) : (
              <LogoutIcon className="logout-icon" />
            )}
          </IconButton>
        }
      />
    </SideBarFooterStyled>
  );
};

export default SideBarFooter;
