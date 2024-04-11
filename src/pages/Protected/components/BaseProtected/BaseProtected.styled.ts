import { styled } from '@mui/system';

export const BaseProtectedStyled = styled('div')(({ theme }) => ({
  '.base-protected-container': {
    width: '100%',
    minHeight: '100vh',
    height: 'max-content',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      width: '100%',
    },
  },
  '.navbar': {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

export const DashboardStyled = styled('div')<{ disablePadding: boolean }>(
  ({ theme, disablePadding }) => ({
    width: '100%',
    padding: disablePadding ? 0 : '1.8rem 1.5rem',
    [theme.breakpoints.down('sm')]: {
      width: 'unset',
    },
  }),
);
