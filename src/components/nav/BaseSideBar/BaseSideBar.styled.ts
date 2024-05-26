import { styled } from '@mui/system';

export const BaseSideBarStyled = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '20rem',
  borderRight: `1px solid ${theme.palette.grey[200]}`,
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
  '.sidebar-wrapper': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '20rem',
    height: '100%',
    '.sidebar-menu-wrapper': {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      gap: '0.75rem',
    },
  },
}));
