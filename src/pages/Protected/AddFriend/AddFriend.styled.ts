import { styled } from '@mui/system';

export const AddFriendStyled = styled('div')(({ theme }) => ({
  '.add-friend-heading': {
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    color: theme.palette.text.primary,
  },
  '.add-friend-email-wrapper': {
    marginTop: '0.5rem',
    display: 'flex',
    gap: '1rem',
    '@media(min-width: 0px) and (max-width: 750px)': {
      alignItems: 'flex-start',
      flexDirection: 'column',
      gap: '0.9rem',
    },
    '.add-friend-text-field-wrapper': {
      width: '18rem',
      '@media(min-width: 0px) and (max-width: 750px)': {
        width: '100%',
      },
      '.add-friend-email-input': {
        width: '18rem',
        fontWeight: 600,
        '@media(min-width: 0px) and (max-width: 750px)': {
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
        '@media(min-width: 0px) and (max-width: 750px)': {
          width: '100%',
        },
      },
    },

    '.add-btn-active': {
      backgroundColor: `${theme.palette.action.active} !important`,
    },
  },
}));
