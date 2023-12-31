import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { CircularProgress, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Authentication } from '../../../../libs';
import { useAuth } from '../../../../hooks';
import { UserProfile } from '../../..';
import { SideBarFooterStyled } from './SideBarFooter.styled';
import { SnackbarContext } from '../../../../contexts';

const SideBarFooter = () => {
  const authentication = new Authentication();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { auth: { email = '', name = '', picture = '' } = {}, setAuth } =
    useAuth();
  const { openSnackbar } = useContext(SnackbarContext);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      googleLogout();
      await authentication.googleLogout();
      localStorage.removeItem('isGoogle');
      setAuth(undefined);
      setIsLoading(false);
      navigate('/', { replace: true });
      window.location.reload();
    } catch (err: any) {
      openSnackbar({
        message: err?.response?.data?.message,
        type: 'error',
      });
      setIsLoading(false);
    }
  };

  return (
    <SideBarFooterStyled>
      <UserProfile
        name={name}
        email={email}
        picture={picture}
        disableHover
        dense={email?.length > 27}
        padding={!email ? '0.5rem 0px' : ''}
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
