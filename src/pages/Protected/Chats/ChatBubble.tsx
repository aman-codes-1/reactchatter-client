import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import { getTime } from '../../../helpers';
import { ChatsAndFriendsContext } from '../../../contexts';
import { ChatBubbleStyled } from './Chats.styled';

const ChatBubble = ({ msg, index, data, side, isResize }: any) => {
  const [isOverflow, setIsOverflow] = useState(false);
  const { selectedChat } = useContext(ChatsAndFriendsContext);
  const containerRef = useRef<any>(null);
  const messageRef = useRef<any>(null);

  const sender = msg?.sender;
  const queuedStatus = sender?.queuedStatus;
  const isQueued = queuedStatus?.isQueued === true;
  const queuedTimestamp = queuedStatus?.timestamp;
  const sentStatus = sender?.sentStatus;
  const isSent = sentStatus?.isSent === true && isQueued;

  let deliveredStatus;
  let deliveredTimestamp;
  let isDelivered;
  let readStatus;
  let readTimestamp;
  let isRead;

  if (selectedChat && selectedChat?.type === 'private') {
    const receiver = msg?.otherMembers?.[0];
    deliveredStatus = receiver?.deliveredStatus;
    deliveredTimestamp = deliveredStatus?.timestamp;
    isDelivered = deliveredStatus?.isDelivered === true && isSent;
    readStatus = receiver?.readStatus;
    readTimestamp = readStatus?.timestamp;
    isRead = readStatus?.isRead === true && isDelivered;
  }

  useLayoutEffect(() => {
    const checkOverflow = () => {
      if (containerRef?.current && messageRef?.current) {
        const containerElement = containerRef?.current;
        const messageElement = messageRef?.current;
        const containerHeight = containerElement?.offsetHeight;
        const messageHeight = messageElement?.offsetHeight;
        const height = containerHeight - messageHeight;
        if (!isNaN(height) && height > 23) {
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
        className={`msg msg-${side} ${attachClass()} ${isQueued && !isSent ? 'msg-animation' : ''} ${isOverflow ? 'msg-overflow' : ''}`}
        ref={containerRef}
        key={`${msg?._id || msg?.queueId}-${index}`}
      >
        {msg?.message ? (
          <Typography
            component="span"
            className={`msg-content msg-content-${side}`}
            ref={messageRef}
          >
            {msg?.message}
          </Typography>
        ) : null}
        <span
          className={`msg-timestamp ${isOverflow ? 'msg-timestamp-overflow' : ''}`}
        >
          {queuedTimestamp ? (
            <Typography
              variant="caption"
              whiteSpace="nowrap"
              fontWeight={500}
              className={`msg-timestamp-text-${side}`}
            >
              {getTime(queuedTimestamp)}
            </Typography>
          ) : null}
          {side === 'right' ? (
            <>
              {isQueued && !isSent ? (
                <AccessTimeIcon fontSize="inherit" />
              ) : null}
              {isSent ? <DoneRoundedIcon fontSize="inherit" /> : null}
              {isDelivered ? <DoneAllRoundedIcon fontSize="inherit" /> : null}
              {isRead ? (
                <DoneAllRoundedIcon fontSize="inherit" color="primary" />
              ) : null}
            </>
          ) : null}
        </span>
      </div>
    </ChatBubbleStyled>
  );
};

export default ChatBubble;
