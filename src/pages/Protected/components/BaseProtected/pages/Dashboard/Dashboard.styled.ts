import { styled } from '@mui/system';

export const DashboardStyled = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100vh',
  overflow: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: 'unset',
  },
}));
