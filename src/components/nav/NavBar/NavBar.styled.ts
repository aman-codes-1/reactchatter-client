import { styled } from '@mui/system';

export const NavBarStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  [theme.breakpoints.down('sm')]: {
    padding: '0.75rem 1rem',
    backgroundColor: theme.palette.grey[100],
  },
  '.nav-logo': {
    display: 'flex',
    alignItems: 'center',
    flex: '1 1 auto',
    padding: '1.25rem 0rem 1.25rem 1.25rem',
    [theme.breakpoints.down('sm')]: {
      padding: '0.375rem 1rem',
      flex: '0 0 5.875rem',
      borderRadius: '8px',
      justifyContent: 'center',
      backgroundColor: theme.palette.grey[400],
    },
    [theme.breakpoints.down('xs')]: {
      flex: '0',
      padding: '0.375rem 1.375rem',
    },
  },
  '.nav-logo-svg': {
    width: '32px',
    height: '32px',
    color: theme.palette.secondary.main,
    [theme.breakpoints.down('sm')]: {
      width: '24px',
      height: '24px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '20px',
      height: '20px',
    },
  },
  '.nav-logo:hover': {
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.palette.grey[400],
    },
  },
  '.nav-menu-btn': {
    padding: '0.375rem 1rem',
    color: theme.palette.common.white,
    backgroundColor: `${theme.palette.action.active} !important`,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  '.nav-menu-btn:hover': {
    backgroundColor: `${theme.palette.action.hover} !important`,
  },
}));
