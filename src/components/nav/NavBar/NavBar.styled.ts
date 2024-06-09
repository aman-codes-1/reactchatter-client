import { styled } from '@mui/system';

export const NavBarStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginRight: '1.5rem',
  gap: '2rem',
  [theme.breakpoints.down('sm')]: {
    margin: 0,
    padding: '0.7rem 1rem',
    backgroundColor: theme.palette.grey[50],
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
  },
  '.nav-logo': {
    display: 'flex',
    alignItems: 'center',
    flex: '1 1 auto',
    padding: '1.3rem 0rem 1.3rem 1.5rem',
    [theme.breakpoints.down('sm')]: {
      width: '30px',
      flex: '0',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      justifyContent: 'center',
    },
    '.nav-logo-svg': {
      width: '32px',
      height: '32px',
      color: theme.palette.secondary.main,
      [theme.breakpoints.down('sm')]: {
        width: '24px',
        height: '24px',
      },
    },
  },
  '.nav-logo:hover': {
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.palette.grey[200],
    },
  },
  '.nav-menu-btn': {
    textTransform: 'none',
    fontFamily: 'Segoe UI',
    fontWeight: 600,
    backgroundColor: `${theme.palette.action.active} !important`,
    color: theme.palette.common.white,
    gap: '0.25rem',
    borderRadius: '0.375rem',
    padding: '0.5rem 1rem',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.down('xs')]: {
      '.MuiButton-endIcon': {
        margin: 0,
      },
    },
  },
  '.nav-menu-btn:hover': {
    backgroundColor: `${theme.palette.action.hover} !important`,
  },
  '.nav-new-chat-btn': {
    textTransform: 'none',
    fontFamily: 'Segoe UI',
    fontWeight: 600,
    gap: '0.25rem',
    borderRadius: '0.375rem',
    padding: '0.45rem 1rem',
    margin: '1rem 0rem',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
    [theme.breakpoints.down('xs')]: {
      '.MuiButton-startIcon': {
        margin: 0,
      },
    },
  },
  '.text-hidden': {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
}));
