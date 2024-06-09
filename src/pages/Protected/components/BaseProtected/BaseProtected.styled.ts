import { styled } from '@mui/system';

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
    flexDirection: 'column',
    '.mobile-navbar': {
      marginTop: 'auto',
    },
    '.hidden-from-mobile': {
      display: 'none',
    },
  },
}));
