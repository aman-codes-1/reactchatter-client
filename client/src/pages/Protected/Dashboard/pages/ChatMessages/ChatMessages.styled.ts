import { styled } from '@mui/system';

export const ChatMessagesStyled = styled('div')(({ theme }) => ({
  height: '80vh',
  overflowY: 'scroll',
  '.avatar': {
    width: 32,
    height: 32,
  },
  '.msg': {
    padding: '8px 16px',
    borderRadius: 4,
    marginBottom: 4,
    display: 'inline-block',
    wordBreak: 'break-all',
    fontFamily:
      // eslint-disable-next-line max-len
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
