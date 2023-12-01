import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../../../hooks';
import { UserProfile } from '../../..';
import { SideBarFooterStyled } from './SideBarFooter.styled';

const SideBarFooter = () => {
  const navigate = useNavigate();
  const { auth: { email = '', name = '', picture = '' } = {}, setAuth } = useAuth();

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('isGoogle');
    setAuth(undefined);
    navigate('/', { replace: true });
    window.location.reload();
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
        secondaryAction={(
          <IconButton className="logout-btn" edge="end" onClick={handleLogout}>
            <LogoutIcon className="logout-icon" />
          </IconButton>
        )}
      />
    </SideBarFooterStyled>
  );
};

export default SideBarFooter;
