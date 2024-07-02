import { display, styled } from '@mui/system';

export const BaseProtectedStyled = styled('div')(({ theme }: any) => ({
  display: 'flex',
  width: '100%',
  height: '100vh',
  maxHeight: '-webkit-fill-available',
  [theme.breakpoints.up('sm')]: {
    '.hidden-from-web': {
      display: 'none',
    },
  },
  [theme.breakpoints.down('sm')]: {
    display: 'block',
    '.mobile-navbar': {
      borderTop: `1px solid ${theme.palette.grey[200]}`,
      top: 'auto',
      bottom: 0,
      zIndex: theme.zIndex.drawer + 1,
    },
    '.hidden-from-mobile': {
      display: 'none',
    },
  },
}));
