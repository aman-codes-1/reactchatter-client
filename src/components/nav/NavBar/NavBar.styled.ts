import { styled } from '@mui/system';

export const NavBarStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginRight: '1.35rem',
  gap: '1rem',
  '@media(min-width: 600px) and (max-width: 800px)': {
    marginRight: '0.7rem',
  },
  [theme.breakpoints.down('sm')]: {
    margin: 0,
    padding: '0.7rem 1rem',
    backgroundColor: theme.palette.grey[50],
  },
  '.nav-logo': {
    display: 'flex',
    alignItems: 'center',
    flex: '1 1 auto',
    padding: '1.3rem 0rem 1.3rem 1.7rem',
    '@media(min-width: 600px) and (max-width: 800px)': {
      padding: '1.5rem 0rem 1.3rem 1.2rem',
    },
    [theme.breakpoints.down('sm')]: {
      flex: '0',
      flexBasis: '5.85rem',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      justifyContent: 'center',
      backgroundColor: theme.palette.grey[200],
    },
    [theme.breakpoints.down('xs')]: {
      flexBasis: '0',
      padding: '0.58rem 1.4rem',
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
  },
  '.nav-logo:hover': {
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.palette.grey[200],
    },
  },
  '.nav-new-chat-btn': {
    textTransform: 'none',
    fontWeight: 600,
    gap: '0.25rem',
    borderRadius: '0.375rem',
    padding: '0.4rem 1rem',
    margin: '1rem 0rem',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
    [theme.breakpoints.down('xs')]: {
      padding: '0.5rem 1rem',
      '.MuiButton-startIcon': {
        margin: 0,
      },
    },
  },
  '.nav-menu-btn': {
    textTransform: 'none',
    fontWeight: 600,
    backgroundColor: `${theme.palette.action.active} !important`,
    color: theme.palette.common.white,
    gap: '0.25rem',
    borderRadius: '0.375rem',
    padding: '0.45rem 1rem',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '0.56rem 1rem',
      '.MuiButton-endIcon': {
        margin: 0,
      },
    },
  },
  '.nav-menu-btn:hover': {
    backgroundColor: `${theme.palette.action.hover} !important`,
  },
  '.text-hidden': {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
}));
