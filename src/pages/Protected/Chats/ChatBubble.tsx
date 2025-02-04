import { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Typography, useTheme } from '@mui/material';
import { MessageStatus } from '../../../components';
import { ChatsAndFriendsContext } from '../../../contexts';
import { checkMessageStatus, getTime } from '../../../helpers';
import { ChatBubbleStyled } from './Chats.styled';

const ChatBubble = ({
  msg,
  side,
  isFirstOfGroup,
  isLastOfGroup,
  isFirstOfDateGroup,
  isLastOfDateGroup,
}: any) => {
  const theme = useTheme();
  const [isResize, setIsResize] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const { selectedChat } = useContext(ChatsAndFriendsContext);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const messageRef = useRef<HTMLSpanElement | null>(null);

  const timestamp = msg?.timestamp;
  const messageStatus = useMemo(
    () => checkMessageStatus(msg, selectedChat),
    [msg, selectedChat],
  );
  const { isQueued } = messageStatus || {};

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsResize((prev) => !prev);
      setIsOverflow(false);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    const checkOverflow = () => {
      if (containerRef?.current && messageRef?.current) {
        const containerElement = containerRef?.current;
        const messageElement = messageRef?.current;
        const containerHeight = containerElement?.offsetHeight;
        const messageHeight = messageElement?.offsetHeight;
        const height = containerHeight - messageHeight;
        if (!isNaN(height) && height < 40) {
          setIsOverflow(false);
        } else {
          setIsOverflow(true);
        }
      }
    };

    checkOverflow();
  }, [msg?._id, msg?.queueId, isResize]);

  const attachClass = () => {
    const classes = [];

    if (isFirstOfGroup || isFirstOfDateGroup) {
      classes.push(`msg-first msg-${side}-first`);
    }
    if (isLastOfGroup || isLastOfDateGroup) {
      classes.push(`msg-last msg-${side}-last`);
    }

    return classes?.length ? classes.join(' ') : '';
  };

  return (
    <ChatBubbleStyled side={side}>
      <div
        ref={containerRef}
        className={`msg msg-${side} ${attachClass()} ${isQueued ? 'msg-animation' : ''} ${isOverflow ? 'msg-overflow' : ''}`}
      >
        {msg?.message ? (
          <Typography
            component="span"
            className={`msg-content msg-content-${side}`}
            fontWeight={470}
            ref={messageRef}
          >
            {msg?.message}
          </Typography>
        ) : null}
        <span
          className={`msg-timestamp ${isOverflow ? 'msg-timestamp-overflow' : ''}`}
        >
          {timestamp ? (
            <Typography
              variant="caption"
              whiteSpace="nowrap"
              fontWeight={500}
              className={`msg-timestamp-text msg-timestamp-text-${side}`}
            >
              {getTime(timestamp)}
            </Typography>
          ) : null}
          {side === 'right' ? (
            <MessageStatus
              messageStatus={messageStatus}
              color={theme.palette.grey[400]}
              readColor={theme.palette.primary.contrastText}
            />
          ) : null}
        </span>
      </div>
    </ChatBubbleStyled>
  );
};

export default ChatBubble;
