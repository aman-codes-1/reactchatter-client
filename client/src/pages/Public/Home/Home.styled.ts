import { styled } from '@mui/system';

export const HomeStyled = styled('div')(({ theme }) => ({
  '.home-container': {
    backgroundImage: 'url(/assets/images/cool-background.svg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '100vh',
    zIndex: '-1',
    userSelect: 'none',
  },
  '.home-wrapper': {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: '0px 30px',
    },
    '.home-header': {
      marginTop: 164,
      textAlign: 'center',
      '.home-heading': {
        fontSize: '58px',
        color: 'white',
        textShadow: '0 1px 0 rgba(255, 255, 255, 0.4)',
        marginBottom: 6,
        [theme.breakpoints.down('sm')]: {
          fontSize: '45px',
        },
      },
      '.home-sub-heading': {
        margin: '6px 0px 6px 0px',
        lineHeight: '32px',
        fontSize: '21px',
        [theme.breakpoints.down('sm')]: {
          fontSize: '19px',
        },
      },
      '.home-login-button': {
        marginTop: 11,
        textTransform: 'none',
        fontWeight: 'bold',
        backgroundColor: '#0F172B',
        width: '120px',
        height: '50px',
        fontSize: '16px',
        borderRadius: 7,
        [theme.breakpoints.down('sm')]: {
          width: '100%',
          height: 'auto',
        },
      },
      '.home-login-button:hover': {
        backgroundColor: '#19284a',
      },
    },
    '.home-footer': {
      margin: 'auto 0px 8px 0px',
      textAlign: 'center',
      '.home-footer-sub-heading': {
        fontSize: '14.5px',
      },
    },
  },
}));
