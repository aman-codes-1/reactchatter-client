import { styled } from '@mui/system';

export const ChatMessagesStyled = styled('div')(({ theme }) => ({
  height: '100%',
  '.chat-wrapper': {
    padding: '0rem 4rem 0rem 3.25rem',
    overflowY: 'scroll',
    marginTop: 'auto',
  },
  '.no-messages-wrapper': {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '.avatar': {
    width: 32,
    height: 32,
  },
  '.msg': {
    padding: '6px 14px',
    borderRadius: 4,
    marginBottom: 4,
    display: 'inline-flex',
    wordBreak: 'break-word',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  '.leftRow': {
    textAlign: 'left',
  },
  '.left': {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: theme.palette.grey[100],
  },
  '.leftFirst': {
    borderTopLeftRadius: 20,
  },
  '.leftLast': {
    borderBottomLeftRadius: 20,
  },
  '.rightRow': {
    textAlign: 'right',
  },
  '.right': {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  '.rightFirst': {
    borderTopRightRadius: 20,
  },
  '.rightLast': {
    borderBottomRightRadius: 20,
  },
}));
