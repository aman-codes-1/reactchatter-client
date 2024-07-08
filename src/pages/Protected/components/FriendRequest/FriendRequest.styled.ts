import { display, styled } from '@mui/system';

export const FriendRequestStyled = styled('div')<{
  isAcceptBtn: boolean;
  hasScrollbar: boolean;
}>(({ theme, isAcceptBtn, hasScrollbar }) => ({
  overflow: 'auto',
  '.friend-request-list': {
    width: '430px',
    maxWidth: hasScrollbar ? 'calc(100% - 1.5rem)' : '100%',
  },
  '.friend-request-wrapper': {
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
  },
  '.friend-request-btn-wrapper': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isAcceptBtn ? 'space-between' : 'flex-end',
    padding: '0rem 0.5rem',
    // [theme.breakpoints.down('md')]: {
    //   gap: '0.25rem',
    //   margin: '0.5rem 0rem 0.5rem 1.5rem',
    // },
    '.friend-request-accept-btn': {
      '.friend-request-accept-btn-icon': {
        color: theme.palette.success.dark,
      },
      '.friend-request-accept-btn-icon:hover': {
        color: theme.palette.success[900],
      },
    },
    '.friend-request-accept-btn:hover': {
      background: theme.palette.success.light,
    },
    '.friend-request-cancel-btn': {
      '.friend-request-cancel-btn-icon': {
        color: theme.palette.error.dark,
      },
      '.friend-request-cancel-btn-icon:hover': {
        color: theme.palette.error[900],
      },
    },
    '.friend-request-cancel-btn:hover': {
      background: theme.palette.error.light,
    },
  },
}));
