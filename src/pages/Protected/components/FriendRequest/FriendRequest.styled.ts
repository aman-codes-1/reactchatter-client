import { styled } from '@mui/system';

export const FriendRequestStyled = styled('div')(({ theme }) => ({
  '.sent-requests-wrapper': {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    width: 'auto',
    maxWidth: '440px',
    minHeight: '3rem',
    outline: '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '0.25rem 0.75rem',
    '.sent-requests-email-wrapper': {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flexBasis: '100%',
      '.sent-requests-email-icon': {
        color: theme.palette.grey[600],
      },
      '.sent-requests-email': {
        lineHeight: '1.75rem',
        fontSize: '1.125rem',
        wordBreak: 'break-all',
      },
    },
    '.sent-requests-btn-wrapper': {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
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
  },
}));
