import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { CircularProgress, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { UserProfile } from '../..';
import { Authentication } from '../../../libs';
import { useAuth, useSnackbar, useSocket } from '../../../hooks';
import { SideBarFooterStyled } from './SideBarFooter.styled';

const SideBarFooter = ({ sx }: any) => {
  const authentication = new Authentication();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { auth: { name = '', email = '', picture = '' } = {}, setAuth } =
    useAuth();
  const { openSnackbar } = useSnackbar();
  const { socket } = useSocket();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      googleLogout();
      await authentication.googleLogout();
    } catch (err: any) {
      openSnackbar({
        message: err?.response?.data?.message,
        type: 'error',
      });
    } finally {
      localStorage.removeItem('isGoogle');
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
        email={email?.length > 27 ? email?.substring(0, 27) + '...' : email}
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
