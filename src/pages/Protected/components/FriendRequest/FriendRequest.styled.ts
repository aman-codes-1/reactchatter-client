import { display, styled } from '@mui/system';

export const FriendRequestStyled = styled('div')<{
  isConfirmBtn: boolean;
  hasScrollbar: boolean;
}>(({ theme, isConfirmBtn, hasScrollbar }) => ({
  overflow: 'auto',
  '.friend-request-list': {
    width: '420px',
    maxWidth: hasScrollbar ? 'calc(100% - 1.5rem)' : '100%',
  },
  '.friend-request-btn': {
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: '8px',
  },
  '.friend-request-action-btn-wrapper': {
    marginTop: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isConfirmBtn ? 'space-between' : 'flex-end',
    // '.friend-request-confirm-btn': {
    //   '.friend-request-confirm-btn-icon': {
    //     color: theme.palette.success.dark,
    //   },
    //   '.friend-request-confirm-btn-icon:hover': {
    //     color: theme.palette.success[900],
    //   },
    // },
    // '.friend-request-confirm-btn:hover': {
    //   background: theme.palette.success.light,
    // },
    // '.friend-request-delete-btn': {
    //   '.friend-request-delete-btn-icon': {
    //     color: theme.palette.error.dark,
    //   },
    //   '.friend-request-delete-btn-icon:hover': {
    //     color: theme.palette.error[900],
    //   },
    // },
    // '.friend-request-delete-btn:hover': {
    //   background: theme.palette.error.light,
    // },
  },
}));
