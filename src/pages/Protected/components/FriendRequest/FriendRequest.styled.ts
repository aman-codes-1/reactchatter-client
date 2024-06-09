import { styled } from '@mui/system';

export const FriendRequestStyled = styled('div')<{ isAcceptBtn: boolean }>(
  ({ theme, isAcceptBtn }) => ({
    overflow: 'auto',
    padding: '0.2rem',
    // width: '100%',
    '.sent-requests-wrapper': {
      // display: 'flex',
      // gap: '1rem',
      // alignItems: 'center',
      // justifyContent: 'space-between',
      // width: 'auto',
      maxWidth: isAcceptBtn ? '440px' : '430px',
      outline: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: '8px',
      [theme.breakpoints.down('sm')]: {
        width: 'auto',
        maxWidth: '100%',
      },
      '.sent-requests-btn-wrapper': {
        marginRight: '0.5rem',
        '.sent-requests-accept-btn': {
          '.sent-requests-accept-btn-icon': {
            color: theme.palette.success.dark,
          },
          '.sent-requests-accept-btn-icon:hover': {
            color: theme.palette.success[900],
          },
        },
        '.sent-requests-accept-btn:hover': {
          background: theme.palette.success.light,
        },
        '.sent-requests-cancel-btn': {
          '.sent-requests-cancel-btn-icon': {
            color: theme.palette.error.dark,
          },
          '.sent-requests-cancel-btn-icon:hover': {
            color: theme.palette.error[900],
          },
        },
        '.sent-requests-cancel-btn:hover': {
          background: theme.palette.error.light,
        },
      },
      '.margin-left-right': {
        marginLeft: '0.1rem',
        marginRight: '0.1rem',
      },
    },
  }),
);
