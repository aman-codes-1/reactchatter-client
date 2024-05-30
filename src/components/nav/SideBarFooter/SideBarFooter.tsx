import { useState } from 'react';
import { CircularProgress, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { UserProfile } from '../..';
import { useApi, useAuth } from '../../../hooks';
import { SideBarFooterStyled } from './SideBarFooter.styled';

const SideBarFooter = ({ sx }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { auth: { name = '', email = '', picture = '' } = {}, setAuth } =
    useAuth();
  const { callLogout } = useApi();

  const handleLogout = async () => {
    await callLogout(setIsLoading);
  };

  return (
    <SideBarFooterStyled sx={sx}>
      <UserProfile
        primaryText={{
          title: name,
        }}
        secondaryText={{
          title:
            email && email?.length > 27
              ? `${email?.substring(0, 27)}...`
              : email,
        }}
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
