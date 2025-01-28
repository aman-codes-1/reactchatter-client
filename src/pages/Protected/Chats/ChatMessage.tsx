import { memo, useRef } from 'react';
import { Chip } from '@mui/material';
import { Avatar } from '../../../components';
import { useAuth } from '../../../hooks';
import { calculateSide, getDateLabel } from '../../../helpers';
import ChatBubble from './ChatBubble';

const ChatMessage = ({
  index: i,
  item: msg,
  lastItemIndex,
  prevItem,
  nextItem,
}: any) => {
  const { auth: { _id = '' } = {} } = useAuth();
  const itemRef = useRef<HTMLDivElement | null>(null);

  const side = calculateSide(msg, _id);
  const currentTimestamp = msg?.timestamp;
  const prevTimestamp = prevItem?.timestamp;
  const nextTimestamp = nextItem?.timestamp;
  const currentDate = getDateLabel(currentTimestamp);
  const prevDate = i > 0 ? getDateLabel(prevTimestamp) : '';
  const nextDate = i < lastItemIndex ? getDateLabel(nextTimestamp) : '';
  const prevSide = i > 0 ? calculateSide(prevItem, _id) : '';
  const nextSide = i < lastItemIndex ? calculateSide(nextItem, _id) : '';
  const isFirstOfGroup = prevSide !== side;
  const isLastOfGroup = nextSide !== side;
  const isFirstOfDateGroup = currentDate !== prevDate;
  const isLastOfDateGroup = currentDate !== nextDate;
  const dateSeparator = currentDate !== prevDate;

  let hasRightBeforeLeft = false;
  let hasRightAfterLeft = false;
  if (side === 'left') {
    if (!dateSeparator && prevSide === 'right') {
      hasRightBeforeLeft = true;
    }
    if (nextSide === 'right') {
      hasRightAfterLeft = true;
    }
  }

  const attachClass = () => {
    const classes = [];

    classes.push('chat-wrapper');

    if (dateSeparator) {
      classes.push('chat-wrapper-date-label');
    }

    if (!dateSeparator && (isFirstOfGroup || isFirstOfDateGroup)) {
      classes.push('chat-wrapper-first');
    }

    if (isLastOfGroup || isLastOfDateGroup) {
      classes.push('chat-wrapper-last');
    }

    if (side === 'left') {
      if (isFirstOfGroup && hasRightBeforeLeft) {
        classes.push('chat-margin-top');
      }
      if (isLastOfGroup && hasRightAfterLeft) {
        classes.push('chat-margin-bottom');
      }
    }

    return classes?.length ? classes.join(' ') : '';
  };

  const renderAvatar = (msg: any, side: string) => {
    if (side === 'left') {
      if (isLastOfGroup) {
        return (
          <Avatar
            alt={msg?.sender?.name}
            src={msg?.sender?.picture}
            sx={{ width: 32, height: 32 }}
          />
        );
      } else {
        return <div style={{ marginLeft: 32 }} />;
      }
    }
    return null;
  };

  return (
    <div ref={itemRef} className={`${attachClass()}`}>
      {dateSeparator ? (
        <div className="date-label-wrapper">
          <Chip
            variant="outlined"
            label={getDateLabel(currentTimestamp)}
            className="date-label-chip"
          />
        </div>
      ) : null}
      <div className="chat-msg">
        {renderAvatar(msg, side)}
        <ChatBubble
          index={i}
          msg={msg}
          side={side}
          isFirstOfGroup={isFirstOfGroup}
          isLastOfGroup={isLastOfGroup}
          isFirstOfDateGroup={isFirstOfDateGroup}
          isLastOfDateGroup={isLastOfDateGroup}
        />
      </div>
    </div>
  );
};

export default memo(ChatMessage);
