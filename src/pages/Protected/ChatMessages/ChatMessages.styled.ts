import { styled } from '@mui/system';

export const ChatMessagesStyled = styled('div')(({ theme }) => ({
  height: '100%',
  '.chat-wrapper': {
    padding: '0rem 2.5rem',
    overflowY: 'auto',
    marginTop: 'auto',
    [theme.breakpoints.down('md')]: {
      padding: '0rem 1rem',
    },
  },
  '.no-messages-wrapper': {
    display: 'flex',
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
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
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
    display: 'flex',
    gap: '0.7rem',
    alignItems: 'center',
    padding: '1rem 2.5rem',
    background: theme.palette.primary.light,
    [theme.breakpoints.down('md')]: {
      padding: '0.7rem 1rem',
    },
  },
}));
