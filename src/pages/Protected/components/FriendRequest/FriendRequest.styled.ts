import { styled } from '@mui/system';

export const FriendRequestStyled = styled('div')<{
  isConfirmBtn: boolean;
}>(({ theme, isConfirmBtn }) => ({
  '.friend-request-loader': {
    gap: '1.125rem',
    [theme.breakpoints.down('md')]: {
      gap: '0.5rem',
    },
    [theme.breakpoints.down('xs')]: {
      gap: '0rem',
    },
  },
  '.friend-request-list-wrapper': {
    overflow: 'auto',
  },
  '.friend-request-list': {
    width: '370px',
    maxWidth: '100%',
  },
  '.friend-request-list-item-btn': {
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: '8px',
    '.MuiButtonBase-root': {
      gap: '1rem',
      [theme.breakpoints.down('md')]: {
        gap: '0.375rem',
      },
      [theme.breakpoints.down('xs')]: {
        gap: '0rem',
      },
    },
  },
  '.friend-request-avatar': {
    fontSize: '1.75rem',
    width: '55px',
    height: '55px',
    [theme.breakpoints.down('md')]: {
      fontSize: '1.5rem',
      width: '45px',
      height: '45px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.25rem',
      width: '40px',
      height: '40px',
    },
  },
  '.friend-request-action-btn-wrapper': {
    display: 'flex',
    padding: '0.25rem 1rem 1rem 1rem',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '0.75rem',
    marginLeft: '4.625rem',
    [theme.breakpoints.down('md')]: {
      marginLeft: '4rem',
    },
    '@media(min-width: 600px) and (max-width: 642px)': {
      margin: 0,
      ...(!isConfirmBtn
        ? {
            flexDirection: 'column',
            alignItems: 'unset',
          }
        : {}),
    },
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      ...(!isConfirmBtn
        ? {
            flexDirection: 'column',
            alignItems: 'unset',
          }
        : {}),
    },
    '@media(min-width: 0px) and (max-width: 276px)': {
      flexDirection: 'column',
      alignItems: 'unset',
    },
  },
  '.flex-item-action-btn': {
    flex: '1 1 auto',
  },
  '.flex-item-action-btn-2': {
    flex: '0 0 7.46rem',
    '@media(min-width: 600px) and (max-width: 642px)': {
      flex: '1 1 auto',
    },
    [theme.breakpoints.down('xs')]: {
      flex: '1 1 auto',
    },
  },
}));
