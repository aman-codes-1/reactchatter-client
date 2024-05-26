import { styled } from '@mui/system';

export const SideBarStyled = styled('div')(({ theme }) => ({
  '.sidebar-middle-wrapper': {
    display: 'flex',
    flexDirection: 'column',
    // maxHeight: 'calc(90vh - 150px)',
    overflowY: 'auto',
    gap: '0.5rem',
    '.chats-menu-wrapper': {
      width: '100%',
      '.chats-wrapper': {
        width: '100%',
        maxHeight: '320px',
        overflowY: 'auto',
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
        overflowY: 'auto',
      },
    },
    '.overview-menu-wrapper': {
      paddingTop: '0.5rem',
      width: '100%',
      '.overview-nav-link-wrapper': {
        paddingTop: '0.875rem',
        width: '100%',
        // '.secondary-action-count:hover': {
        //   cursor: 'pointer'
        // },
      },
    },
    '.sidebar-heading': {
      paddingLeft: '0.45rem',
      fontSize: '0.8rem',
      color: theme.palette.grey[800],
    },
  },
  '.list-item-icon': {
    padding: '0.15rem',
    fontSize: '1.1rem',
    color: theme.palette.grey[600],
    outline: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: '8px',
  },
}));
