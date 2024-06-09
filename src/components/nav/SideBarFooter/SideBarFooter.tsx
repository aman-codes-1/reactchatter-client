import { useState } from 'react';
import { CircularProgress, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { ListItem } from '../..';
import { useApi, useAuth } from '../../../hooks';
import { SideBarFooterStyled } from './SideBarFooter.styled';

const SideBarFooter = ({ className }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { auth: { name = '', email = '', picture = '' } = {} } = useAuth();
  const { callLogout } = useApi();

  const handleLogout = async () => {
    await callLogout(setIsLoading);
  };

  return (
    <SideBarFooterStyled className={className}>
      <ListItem
        primaryText={{
          title: name,
          fontSize: '1.03rem',
          fontWeight: 600,
        }}
        secondaryText={{
          title: email,
          fontSize: '0.79rem',
          fontWeight: 500,
        }}
        isAvatar
        picture={picture}
        disableHover
        minHeight="2.95rem"
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
