import { display, styled } from '@mui/system';

export const BaseProtectedStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: '100vh',
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
    },
    '.hidden-from-mobile': {
      display: 'none',
    },
  },
}));
