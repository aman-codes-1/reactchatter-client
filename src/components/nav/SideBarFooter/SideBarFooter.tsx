import { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { LoadingButton } from '@mui/lab';
import { ListItem } from '../..';
import { useApi, useAuth } from '../../../hooks';
import { SideBarFooterStyled } from './SideBarFooter.styled';

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
          <LoadingButton
            loading={isLoading}
            sx={{ height: '2.95rem', ml: '1.5rem', mb: '0.5rem' }}
            endIcon={<LogoutIcon />}
            variant="outlined"
            onClick={handleLogout}
          />
        }
        disablePadding
      />
    </SideBarFooterStyled>
  );
};

export default SideBarFooter;
