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
  margin: '0rem 1.3rem',
  overflow: 'auto',
  '@media(min-width: 0px) and (max-width: 800px)': {
    margin: '1rem 0.6rem',
  },
  '.margin-top': {
    marginTop: '1.5rem',
  },
  '.default-heading': {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: theme.palette.grey[800],
  },
  '.heading': {
    fontSize: '1.7rem',
    fontWeight: 800,
  },
  '.chats-wrapper': {
    width: '100%',
    flex: toggleChats ? '0 1 auto' : '',
    minHeight:
      (toggleChats && chats?.length > 1 && chats?.length <= 2 && '140px') ||
      (toggleChats && chats?.length > 2 && '210px') ||
      '4.4rem',
    overflow: 'auto',
  },
  '.friends-wrapper': {
    width: '100%',
    flex: toggleFriends ? '0 1 auto' : '',
    minHeight: toggleFriends && otherFriends?.length > 1 ? '140px' : '4.4rem',
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
    borderRadius: '8px',
  },
}));
