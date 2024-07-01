import { styled } from '@mui/system';

export const DashboardStyled = styled('div')<{
  overlayHeight: number;
}>(({ theme, overlayHeight }) => ({
  width: '100%',
  height: `calc(100vh - ${overlayHeight || 0}px)`,
  overflow: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: 'unset',
  },
}));
