import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { Typography, useTheme } from '@mui/material';
import { ChatsAndFriendsContext } from '../../../contexts';
import { checkMessageStatus, getTime } from '../../../helpers';
import { MessageStatus } from '../components';
import { ChatBubbleStyled } from './Chats.styled';

const ChatBubble = ({ msg, index, data, side, isResize }: any) => {
  const theme = useTheme();
  const [isOverflow, setIsOverflow] = useState(false);
  const { selectedItem } = useContext(ChatsAndFriendsContext);
  const containerRef = useRef<any>(null);
  const messageRef = useRef<any>(null);

  const timestamp = msg?.timestamp;
  const messageStatus = checkMessageStatus(msg, selectedItem);
  const { isQueued } = messageStatus || {};

  useLayoutEffect(() => {
    const checkOverflow = () => {
      if (containerRef?.current && messageRef?.current) {
        const containerElement = containerRef?.current;
        const messageElement = messageRef?.current;
        const containerHeight = containerElement?.offsetHeight;
        const messageHeight = messageElement?.offsetHeight;
        const height = containerHeight - messageHeight;
        if (!isNaN(height) && height > 24) {
          setIsOverflow(true);
        } else {
          setIsOverflow(false);
        }
      }
    };

    checkOverflow();
  }, [msg?._id, msg?.queueId, isResize]);

  const attachClass = () => {
    if (index === 0) {
      return `msg-${side}-first`;
    }
    if (data && Array.isArray(data) && index === data?.length - 1) {
      return `msg-${side}-last`;
    }
    return '';
  };

  return (
    <ChatBubbleStyled>
      <div
        className={`msg msg-${side} ${attachClass()} ${isQueued ? 'msg-animation' : ''} ${isOverflow ? 'msg-overflow' : ''}`}
        ref={containerRef}
        key={`${msg?._id || msg?.queueId}-${index}`}
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
