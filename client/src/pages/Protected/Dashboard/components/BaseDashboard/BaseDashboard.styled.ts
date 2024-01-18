import { styled } from '@mui/system';

export const BaseDashboardStyled = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100vh',
  display: 'flex',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    width: '100%',
  },
  '.navbar': {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));
