import { styled } from '@mui/system';

export const BaseSideBarStyled = styled('div')(({ theme }) => ({
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
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      gap: '0.75rem',
    },
    '.sidebar-middle-wrapper': {
      display: 'flex',
      flexDirection: 'column',
      // maxHeight: 'calc(90vh - 150px)',
      overflowY: 'scroll',
      gap: '0.5rem',
      '.chats-menu-wrapper': {
        width: '100%',
        '.chats-wrapper': {
          width: '100%',
          maxHeight: '320px',
          overflowY: 'scroll',
        },
        '.heading': {
          fontSize: '1.25rem',
        },
      },
      '.your-friends-menu-wrapper': {
        width: '100%',
        '.friends-wrapper': {
          width: '100%',
          maxHeight: '320px',
          overflowY: 'scroll',
        },
      },
      '.overview-menu-wrapper': {
        paddingTop: '0.5rem',
        width: '100%',
        '.overview-nav-link-wrapper': {
          paddingTop: '0.875rem',
          width: '100%',
        },
      },
      '.sidebar-heading': {
        paddingLeft: '0.45rem',
        fontSize: '0.8rem',
        color: theme.palette.grey[800],
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
