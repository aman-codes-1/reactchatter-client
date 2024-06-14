import { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { LoadingButton } from '@mui/lab';
import { ListItem } from '../..';
import { useApi, useAuth } from '../../../hooks';
import { SideBarFooterStyled } from './SideBarFooter.styled';

const SideBarFooter = ({ className }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { auth: { name = '', email = '', picture = '' } = {}, setIsLogout } =
    useAuth();
  const { callLogout } = useApi();

  const handleLogout = async () => {
    setIsLoading(true);
    await callLogout();
    setIsLogout(true);
    setIsLoading(false);
  };

  return (
    <SideBarFooterStyled className={className}>
      <ListItem
        primaryText={{
          title: name,
          fontSize: '1.03rem',
          fontWeight: 600,
          ellipsesLineClamp: '1',
        }}
        secondaryText={{
          title: email,
          fontSize: '0.79rem',
          fontWeight: 500,
          ellipsesLineClamp: '1',
        }}
        isAvatar
        picture={picture}
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
        avatarWidth={37}
        avatarHeight={37}
      />
    </SideBarFooterStyled>
  );
};

export default SideBarFooter;
