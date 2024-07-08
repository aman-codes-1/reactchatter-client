import { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { ListItem, ListItemButton } from '../..';
import { useApi, useAuth } from '../../../hooks';
import { SideBarFooterStyled } from './SideBarFooter.styled';
import { CircularProgress, List } from '@mui/material';

const SideBarFooter = ({ className }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { auth: { name = '', email = '', picture = '' } = {} } = useAuth();
  const { callLogout } = useApi();

  const handleLogout = async () => {
    setIsLoading(true);
    await callLogout();
    setIsLoading(false);
  };

  return (
    <SideBarFooterStyled className={className}>
      <List dense disablePadding>
        <ListItem
          primaryText={{
            title: name,
            fontSize: '1rem',
            fontWeight: 500,
            ellipsesLineClamp: '1',
          }}
          secondaryText={{
            title: email,
            fontSize: '0.79rem',
            ellipsesLineClamp: '1',
          }}
          avatar={{
            src: picture,
          }}
          disableHover
          btnHeight="4.4rem"
          endIcon={
            <ListItemButton
              startIcon={
                isLoading ? (
                  <CircularProgress
                    size={20}
                    color="secondary"
                    sx={{ m: '0rem 0.2rem' }}
                  />
                ) : (
                  <LogoutIcon fontSize="small" sx={{ m: '0rem 0.2rem' }} />
                )
              }
              disableHover={isLoading}
              disabled={isLoading}
              width="auto"
              variant="outlined"
              btnHeight="3.5rem"
              sx={{ ml: '1.7rem', mb: '0.6rem' }}
              onClick={handleLogout}
            />
          }
          disablePadding
        />
      </List>
    </SideBarFooterStyled>
  );
};

export default SideBarFooter;
