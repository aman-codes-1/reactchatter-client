import { styled } from '@mui/system';

export const AddFriendStyled = styled('div')(({ theme }) => ({
  marginTop: '0.45rem',
  '.add-friend-heading': {
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    color: theme.palette.text.primary,
  },
  '.add-friend-email-wrapper': {
    marginTop: '0.6rem',
    display: 'flex',
    gap: '1rem',
    [theme.breakpoints.down('md')]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
      gap: '0.9rem',
    },
    '.add-friend-text-field-wrapper': {
      width: '18rem',
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
      '.add-friend-email-input': {
        width: '18rem',
        fontWeight: 600,
        [theme.breakpoints.down('md')]: {
          width: '100%',
        },
      },
      '.add-friend-email-input-props': {
        fontWeight: 600,
      },
    },
    '.add-friend-email-btn-wrapper': {
      width: '100%',
      '.add-friend-email-btn': {
        textTransform: 'none',
        fontSize: '0.875rem',
        fontWeight: 700,
        [theme.breakpoints.down('md')]: {
          width: '100%',
        },
      },
    },

    '.add-btn-active': {
      backgroundColor: `${theme.palette.action.active} !important`,
    },
  },
}));
