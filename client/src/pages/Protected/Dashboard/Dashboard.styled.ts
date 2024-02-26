import { styled } from '@mui/system';

export const DashboardStyled = styled('div')<{ disablePadding: boolean }>(
  ({ theme, disablePadding }) => ({
    width: '100%',
    padding: disablePadding ? 0 : '1.8rem 1.5rem',
    [theme.breakpoints.down('sm')]: {
      width: 'unset',
    },
  }),
);
