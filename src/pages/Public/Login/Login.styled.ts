import { styled } from '@mui/system';

export const LoginStyled = styled('div')(({ theme }) => ({
  marginTop: 124,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: '0px 30px',
  },
  '.sign-in-heading': {
    fontSize: '30px',
    marginBottom: '30px',
    textAlign: 'center',
  },
  '.google-login-btn': {
    textTransform: 'none',
    fontWeight: 'bold',
    width: '400px',
    minHeight: '40px',
    height: 'auto',
    borderRadius: '6px',
    fontSize: '14.5px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: 'auto',
      minHeight: '40px',
    },
  },
  '.btn-active': {
    backgroundColor: `${theme.palette.action.active} !important`,
  },
  '.btn-active:hover': {
    backgroundColor: `${theme.palette.action.hover} !important`,
  },
  '.btn-disabled': {
    color: `${theme.palette.common.white} !important`,
    backgroundColor: `${theme.palette.grey[500]} !important`,
    '.MuiLoadingButton-loadingIndicator': {
      display: 'none',
    },
  },
  '.loading-indicator': {
    color: theme.palette.common.white,
  },
}));
