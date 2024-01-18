import { styled } from '@mui/system';

export const SideBarStyled = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '20rem',
  borderRight: '1px solid #E5E7EB',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
  '.sidebar-wrapper': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '20rem',
    height: '100%',
    '.sidebar-menu-wrapper': {
      padding: '0rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      width: '100%',
      maxWidth: '17rem',
      gap: '1.45rem',
      '.your-chats-menu-wrapper': {
        maxHeight: '320px',
        overflowY: 'scroll',
        width: '100%',
        '.your-chats-chat-wrapper': {
          width: '100%',
          paddingTop: '0.875rem',
        },
      },
      '.overview-menu-wrapper': {
        width: '100%',
        paddingTop: '0.5rem',
        '.overview-nav-link-wrapper': {
          width: '100%',
          paddingTop: '0.875rem',
        },
      },
      '.sidebar-heading': {
        paddingLeft: '0.45rem',
        fontSize: '0.75rem',
        color: theme.palette.grey[600],
      },
    },
  },
  '.list-item-icon': {
    padding: '0.15rem',
    fontSize: '1.1rem',
    color: theme.palette.grey[600],
    outline: '1px solid #E5E7EB',
    borderRadius: '8px',
  },
}));
