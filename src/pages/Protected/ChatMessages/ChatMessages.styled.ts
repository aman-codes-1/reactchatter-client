import { styled } from '@mui/system';

export const ChatMessagesStyled = styled('div')<{
  navbarHeight: number;
  textFieldHeight: number;
}>(({ theme, navbarHeight, textFieldHeight }) => ({
  height: '100%',
  '.chat-container': {
    display: 'flex',
    width: '100%',
    paddingBottom: '1rem',
    height: `calc(100svh - ${textFieldHeight || 0}px)`,
    [theme.breakpoints.down('sm')]: {
      height: `calc(100svh - ${textFieldHeight || 0}px - ${navbarHeight || 0}px)`,
    },
  },
  '.chat-wrapper': {
    width: '100%',
    padding: '0rem 2.5rem',
    overflow: 'auto',
    marginTop: 'auto',
    [theme.breakpoints.down('md')]: {
      padding: '0rem 1rem',
    },
  },
  '.no-messages-wrapper': {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '.msg': {
    display: 'inline-flex',
    padding: '6px 14px',
    borderRadius: 4,
    marginTop: 5,
    wordBreak: 'break-word',
  },
  '.leftRow': {
    textAlign: 'left',
  },
  '.rightRow': {
    textAlign: 'right',
  },
  '.left': {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: theme.palette.grey[100],
  },
  '.right': {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  '.leftFirst': {
    borderTopLeftRadius: 20,
  },
  '.rightFirst': {
    borderTopRightRadius: 20,
  },
  '.leftLast': {
    borderBottomLeftRadius: 20,
  },
  '.rightLast': {
    borderBottomRightRadius: 20,
  },
  '.text-field-wrapper': {
    position: 'fixed',
    width: 'stretch',
    top: 'auto',
    bottom: 0,
    display: 'flex',
    gap: '0.7rem',
    alignItems: 'center',
    padding: '1rem 2.5rem',
    background: theme.palette.primary.light,
    [theme.breakpoints.down('md')]: {
      padding: '0.7rem 1rem',
    },
    [theme.breakpoints.down('sm')]: {
      bottom: navbarHeight,
    },
  },
}));
