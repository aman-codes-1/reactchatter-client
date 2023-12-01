import { styled } from '@mui/system';

export const DashboardStyled = styled('div')(({ theme }) => ({
  width: '100%',
  padding: '3rem 1.5rem',
  [theme.breakpoints.down('sm')]: {
    width: 'unset',
  },
}));
