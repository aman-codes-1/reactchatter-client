import { List } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button, ListItem } from '../..';
import { useApi, useAuth } from '../../../hooks';
import { SideBarFooterStyled } from './SideBarFooter.styled';

const SideBarFooter = ({ className }: any) => {
  const { auth: { name = '', email = '', picture = '' } = {} } = useAuth();
  const { callLogout } = useApi();

  const handleLogout = async () => {
    await callLogout();
  };

  return (
    <SideBarFooterStyled className={className}>
      <List dense>
        <ListItem
          disablePadding
          disableGutters
          disableHover
          btnProps={{
            textProps: {
              primary: name,
              secondary: email,
              slotProps: {
                secondary: {
                  fontSize: '0.75rem',
                },
              },
              style: {
                WebkitLineClamp: 1,
              },
            },
            avatarProps: {
              src: picture,
            },
            endIcon: (
              <Button
                color="secondary"
                variant="outlined"
                onClick={handleLogout}
                startIcon={<LogoutIcon fontSize="small" />}
                className="text-hidden"
                sx={{
                  minHeight: '52px',
                  minWidth: '54px',
                  ml: '1.75rem',
                }}
              />
            ),
          }}
        />
      </List>
    </SideBarFooterStyled>
  );
};

export default SideBarFooter;
