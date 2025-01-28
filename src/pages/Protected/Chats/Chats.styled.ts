import { styled, keyframes } from '@mui/system';

const fadeIn = keyframes`
  0% {
    // opacity: 0;
    transform: scale(0.95);
  }
  100% {
    // opacity: 1;
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  0% {
    // opacity: 1;
    transform: scale(1);
  }
  100% {
    // opacity: 0;
    transform: scale(1.05);
  }
`;

export const ChatsStyled = styled('div')<{
  navbarHeight: number;
  sideBarWidth: number;
  message: string;
}>(({ theme, navbarHeight, sideBarWidth, message }) => ({
  '.app-bar-wrapper': {
    position: 'fixed',
    width: `calc(100% - ${sideBarWidth || 0}px)`,
    top: 0,
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  '.app-bar': {
    minHeight: '4rem',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.light,
  },
  '.text-field-wrapper': {
    position: 'fixed',
    width: `calc(100% - ${sideBarWidth || 0}px)`,
    top: 'auto',
    bottom: 0,
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      bottom: navbarHeight,
    },
  },
  '.text-field-app-bar': {
    padding: message ? '0.875rem 0.875rem 0.875rem 4rem' : '0.875rem 4rem',
    [theme.breakpoints.down('md')]: {
      padding: '0.875rem 2rem',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0.875rem 1rem',
    },
  },
  '.text-field-input-wrapper': {
    display: 'flex',
    gap: '0.625rem',
    alignItems: 'center',
    width: '100%',
  },
  '.text-field-input': {
    borderRadius: '10px',
    backgroundColor: theme.palette.common.white,
    height: 44,
  },
}));

export const ChatGroupsStyled = styled('div')<{
  navbarHeight: number;
  appBarHeight: number;
  textFieldHeight: number;
}>(({ theme, navbarHeight, appBarHeight, textFieldHeight }) => ({
  '.chat-container': {
    width: '100%',
    marginTop: `${appBarHeight}px`,
    overflow: 'auto',
    padding: '0rem 4rem',
    height: `calc(100dvh - ${appBarHeight || 0}px - ${textFieldHeight || 0}px)`,
    [theme.breakpoints.down('md')]: {
      padding: '0rem 2rem',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0rem 1rem',
      height: `calc(100dvh - ${appBarHeight || 0}px - ${textFieldHeight || 0}px - ${navbarHeight || 0}px)`,
    },
  },
  '.no-messages-wrapper': {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '.chat-viewport': {
    marginBottom: '1.5rem',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '1.125rem',
    },
  },
  '.chat-msg': {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '0.625rem',
  },
  '.chat-wrapper': {
    padding: '0.15rem 0rem',
  },
  '.chat-wrapper-date-label': {
    padding: '1.625rem 0rem 0.15rem 0rem',
  },
  '.chat-wrapper-first': {
    paddingTop: '0 !important',
  },
  '.chat-wrapper-last': {
    paddingBottom: '0 !important',
  },
  '.chat-margin-top': {
    paddingTop: '0.625rem !important',
  },
  '.chat-margin-bottom': {
    paddingBottom: '0.625rem !important',
  },
  '.date-label-wrapper': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  '.date-label-chip': {
    borderRadius: '8px',
    '& .MuiChip-label': {
      fontWeight: 500,
      display: 'block',
      whiteSpace: 'normal',
      textTransform: 'uppercase',
      fontSize: '0.75rem',
    },
  },
}));

export const ChatBubbleStyled = styled('div')<{
  side: string;
}>(({ theme, side }) => ({
  display: 'flex',
  flexDirection: side === 'right' ? 'row-reverse' : 'row',
  width: '80%',
  marginLeft: side === 'right' ? 'auto' : '',
  '.msg': {
    display: 'inline-block',
    maxWidth: '100%',
    padding: '8px 14px 10px 14px',
    borderRadius: 5,
    textAlign: 'left',
    position: 'relative',
    wordBreak: 'break-all',
  },
  '.msg-overflow': {
    display: 'flex',
    flexDirection: 'column',
  },
  '.msg-animation': {
    transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
    animation: `${fadeIn} 0.5s ease-in-out`,
    '&.fade-out': {
      animation: `${fadeOut} 0.5s ease-in-out`,
    },
  },
  '.msg-left': {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: theme.palette.grey[200],
  },
  '.msg-right': {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: theme.palette.primary.main,
  },
  '.msg-left-first': {
    borderTopLeftRadius: 16,
  },
  '.msg-right-first': {
    borderTopRightRadius: 16,
  },
  '.msg-left-last': {
    borderBottomLeftRadius: 16,
  },
  '.msg-right-last': {
    borderBottomRightRadius: 16,
  },
  '.msg-content': {
    wordBreak: 'break-all',
    fontSize: '0.938rem',
  },
  '.msg-content-left': {
    color: theme.palette.text.primary,
  },
  '.msg-content-right': {
    color: theme.palette.common.white,
  },
  '.msg-timestamp': {
    display: 'flex',
    gap: '0.25rem',
    alignItems: 'center',
    position: 'relative',
    float: 'right',
    top: '10px',
    marginBottom: '4px',
    marginLeft: '0.75rem',
    whiteSpace: 'nowrap',
  },
  '.msg-timestamp-overflow': {
    alignSelf: 'flex-end',
    top: 4,
    marginBottom: 0,
  },
  '.msg-timestamp-text': {
    fontSize: '0.688rem',
  },
  '.msg-timestamp-text-left': {
    color: theme.palette.text.secondary,
  },
  '.msg-timestamp-text-right': {
    color: theme.palette.grey[400],
  },
}));
