import { Drawer as MuiDrawer, useTheme } from '@mui/material';

const Drawer = ({ anchor, isOpen, onClose, isMobile, children }: any) => {
  const theme = useTheme();

  return (
    <MuiDrawer
      anchor={anchor}
      open={isOpen}
      onClose={onClose}
      sx={
        isMobile
          ? {
              [theme.breakpoints.up('sm')]: {
                display: 'none',
              },
            }
          : {}
      }
      PaperProps={{
        sx: { width: '80vw' },
      }}
    >
      {children}
    </MuiDrawer>
  );
};

export default Drawer;
