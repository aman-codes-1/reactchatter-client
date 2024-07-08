import { styled } from '@mui/system';

export const SideBarListStyled = styled('div')<{
  toggleChats: boolean;
  toggleFriends: boolean;
}>(({ theme, toggleChats, toggleFriends }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  margin: '0rem 1.3rem',
  overflow: 'auto',
  [theme.breakpoints.down('md')]: {
    margin: '1rem 0.6rem 0rem 0.6rem',
  },
  '.margin-top': {
    marginTop: '1.5rem',
  },
  '.default-heading': {
    fontSize: '0.825rem',
    fontWeight: 700,
    color: theme.palette.grey[800],
  },
  '.heading': {
    fontSize: '1.725rem',
    fontWeight: 701,
  },
  '.chats-wrapper': {
    width: '100%',
    flex: toggleChats ? '0 1 auto' : '',
    minHeight: '5.8rem',
    overflow: 'auto',
  },
  '.friends-wrapper': {
    width: '100%',
    flex: toggleFriends ? '0 1 auto' : '',
    minHeight: '4.6rem',
    overflow: 'auto',
  },
  '.overview-wrapper': {
    marginTop: '0.3rem',
    flex: '0 0 auto',
    width: '100%',
  },
  '.list-item-icon': {
    marginRight: '1rem',
    padding: '0.15rem',
    fontSize: '1.1rem',
    color: theme.palette.grey[600],
    outline: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: '7px',
  },
}));
