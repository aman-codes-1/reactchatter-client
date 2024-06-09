import { styled } from '@mui/system';

export const SideBarListStyled = styled('div')<{
  chats: any[];
  otherFriends: any[];
  toggleChats: boolean;
  toggleFriends: boolean;
}>(({ theme, chats, otherFriends, toggleChats, toggleFriends }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  margin: '0rem 1.5rem',
  overflowY: 'auto',
  '.default-heading': {
    paddingLeft: chats?.length || otherFriends?.length ? '0.45rem' : '',
    fontSize: '0.8rem',
    letterSpacing: '0.04rem',
    color: theme.palette.grey[800],
  },
  '.heading': {
    fontSize: '1.7rem',
  },
  '.chats-wrapper': {
    width: '100%',
    flex: toggleChats ? '0 1 auto' : '',
    minHeight:
      (toggleChats && chats?.length > 1 && chats?.length <= 2 && '140px') ||
      (toggleChats && chats?.length > 2 && '210px') ||
      '4.4rem',
    overflowY: 'auto',
  },
  '.friends-wrapper': {
    width: '100%',
    flex: toggleFriends ? '0 1 auto' : '',
    minHeight: toggleFriends && otherFriends?.length > 1 ? '140px' : '4.4rem',
    overflowY: 'auto',
  },
  '.overview-wrapper': {
    marginTop: '0.3rem',
    width: '100%',
    overflowY: 'auto',
    minHeight: '8rem',
  },
  '.list-item-icon': {
    padding: '0.15rem',
    fontSize: '1.1rem',
    color: theme.palette.grey[600],
    outline: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: '8px',
  },
}));
