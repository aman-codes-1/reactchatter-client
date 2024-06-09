import { styled } from '@mui/system';

export const BaseProtectedStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: '100vh',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
  '.mobile-component': {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  '.mobile-navbar': {
    [theme.breakpoints.down('sm')]: {
      marginTop: 'auto',
    },
  },
  '.mobile-search-bar': {
    [theme.breakpoints.down('sm')]: {
      margin: '2rem 1rem 0rem 1rem',
    },
  },
  '.mobile-drawer': {
    display: {
      xs: 'block',
      sm: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));
