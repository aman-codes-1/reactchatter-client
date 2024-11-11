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
    width: '400px',
    maxWidth: '100%',
  },
  '.friend-request-list-item-btn': {
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
    marginTop: '0.85rem',
    display: 'flex',
    justifyContent: isConfirmBtn ? 'space-between' : 'flex-end',
    gap: '1rem',
    '@media(min-width: 600px) and (max-width: 735px)': {
      flexDirection: 'column',
    },
    '@media(min-width: 0px) and (max-width: 425px)': {
      flexDirection: 'column',
    },
  },
  '.friend-request-text-wrapper': {
    margin: '0.7rem 0rem',
    [theme.breakpoints.down('md')]: {
      margin: '0.42rem 0rem',
    },
    [theme.breakpoints.down('xs')]: {
      margin: '0.25rem 0rem',
    },
  },
}));
