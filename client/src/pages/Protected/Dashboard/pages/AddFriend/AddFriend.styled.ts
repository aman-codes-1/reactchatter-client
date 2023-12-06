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
    alignItems: 'center',
    gap: '1rem',
    '@media(min-width: 0px) and (max-width: 416px)': {
      alignItems: 'flex-start',
      flexDirection: 'column',
      gap: '0.9rem',
    },
    '.add-friend-email-input': {
      width: '18rem',
      fontSize: '0.875rem',
      fontWeight: 'bold',
      '@media(min-width: 0px) and (max-width: 416px)': {
        width: '100%',
      },
    },
    '.add-friend-email-input-props': {
      height: '1.5rem',
      fontSize: '0.875rem',
      fontWeight: 'bold',
    },
    '.add-friend-email-btn': {
      height: '2.5rem',
      textTransform: 'none',
      fontSize: '0.875rem',
      fontWeight: 'bold',
      '@media(min-width: 0px) and (max-width: 416px)': {
        width: '100%',
      },
    },
    '.add-friend-email-btn:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '.add-btn-active': {
      backgroundColor: theme.palette.action.active,
    },
  },
}));
