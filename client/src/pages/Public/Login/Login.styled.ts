import { styled } from '@mui/system';

export const LoginStyled = styled('div')(({ theme }) => ({
  '.sign-in-wrapper': {
    marginTop: 126,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '0px 30px',
    },
    '.sign-in-heading': {
      fontSize: '28px',
      marginBottom: '30px',
      textAlign: 'center',
    },
  },
}));
