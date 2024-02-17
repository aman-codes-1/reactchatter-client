import {
  ChangeEvent,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DoneIcon from '@mui/icons-material/Done';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { FriendsContext } from '../../../../../contexts';
import { useAuth, useChats, useResize } from '../../../../../hooks';
import { getTime, handleKeyPress } from '../../../../../helpers';
import { ChatMessagesStyled } from './ChatMessages.styled';

const ChatMessages = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { messages: msgs, messageGroups: msgGroups } = state || {};
  const { auth: { _id = '' } = {} } = useAuth();
  const { state: { data = [] } = {} } = useContext(FriendsContext);
  const scrollRef = useRef<any>(null);
  const [message, setMessage] = useState('');
  const [messagesQueue, setMessagesQueue] = useState<any[]>([]);
  const [heights, setHeights] = useState<any[]>([]);
  const [heights2, setHeights2] = useState<any[]>([]);
  const { height, width } = useResize();
  const id = params?.id;
  const friend = data?.length ? data?.find((el: any) => el?._id === id) : {};
  const channelId = friend?._id || '';
  const friendId = friend?.friendDetails?._id || '';
  const friendAvatarSrc = friend?.friendDetails?.picture || '';
  const {
    getChats,
    loadingQuery,
    messages,
    setMessages,
    makeMessageGroups,
    messageGroups,
    setMessageGroups,
    newChat,
  } = useChats(channelId, setMessagesQueue);

  const useArrayRef = () => {
    const refs: any[] = [];
    return [refs, (el: any) => el && refs.push(el)];
  };

  const [elements, ref]: any = useArrayRef();
  const [elements2, ref2]: any = useArrayRef();

  useLayoutEffect(() => {
    setMessages([]);
    setMessageGroups([]);
    if (msgs) {
      setMessages(msgs);
    }
    if (msgGroups) {
      setMessageGroups(msgGroups);
    }
  }, [id]);

  useLayoutEffect(() => {
    if (messages?.length) {
      setHeights([]);
      setHeights(
        elements.map((element: any, idx: number) => ({
          msgId: messages?.[idx]?._id,
          height: element?.clientHeight,
        })),
      );
    }
  }, [messages, width, height]);

  useLayoutEffect(() => {
    if (messagesQueue?.length) {
      setHeights2([]);
      setHeights2(
        elements2.map((element: any, idx: number) => ({
          msgTimestamp: messagesQueue?.[idx]?.timestamp,
          height: element?.clientHeight,
        })),
      );
    }
  }, [messagesQueue, width, height]);

  useLayoutEffect(() => {
    if (heights?.length || heights2?.length || messageGroups?.length) {
      scrollRef?.current?.scrollIntoView({
        behavior: 'instant',
        block: 'end',
      });
    }
  }, [heights, heights2, messageGroups, width, height]);

  const fetchChats = async () => {
    await getChats({
      variables: {
        channelId,
      },
      fetchPolicy: 'network-only',
      onCompleted: (res: any) => {
        const chats = res?.chats;
        setMessagesQueue((prev: any[]) => {
          if (prev?.length && chats?.length) {
            const queue = prev?.filter(
              (el: any) =>
                !chats?.some((el2: any) => el?.timestamp === el2?.timestamp),
            );
            return queue;
          }
          return prev;
        });
        setMessages(chats);
        const messageGroupsData = makeMessageGroups(chats, _id);
        setMessageGroups(messageGroupsData);
      },
    });
  };

  useLayoutEffect(() => {
    if (
      window.performance.getEntriesByType('navigation')[0].type === 'reload' ||
      !msgs ||
      !msgGroups
    ) {
      fetchChats();
    }
  }, []);

  if (!channelId) {
    navigate('/dashboard');
  }

  const attachClass = (chats: any, index: number, side: string) => {
    if (index === 0) {
      return `${side}First`;
    }
    if (chats && index === chats.length - 1) {
      return `${side}Last`;
    }
    return '';
  };

  const renderChat = (msg: any, index: number, chats: any, side: string) => {
    const msgHeight = heights?.length
      ? heights?.find((el: any) => el?.msgId === msg?._id)?.height || 0
      : 0;
    return (
      <div className={`${side}Row`} key={msg?._id} ref={ref}>
        <Typography
          align="left"
          className={`msg ${side} ${attachClass(chats, index, side)}`}
          sx={{
            gap: msgHeight > 50 ? '' : '1.2rem',
            alignItems: msgHeight > 50 ? 'flex-start' : 'center',
            flexDirection: msgHeight > 50 ? 'column' : 'row',
          }}
        >
          {msg?.message}
          <div
            style={{
              display: 'flex',
              gap: '0.2rem',
              marginTop: '0.875rem',
              alignItems: 'center',
              alignSelf: 'flex-end',
            }}
          >
            {msg?.timestamp ? (
              <Typography variant="caption">
                {getTime(msg?.timestamp)}
              </Typography>
            ) : null}
            {side === 'right' && msg?.status === 'sent' ? (
              <DoneIcon sx={{ fontSize: 16, p: '2px' }} />
            ) : null}
            {side === 'right' && msg?.status === 'read' ? (
              <DoneAllIcon sx={{ fontSize: 16, p: '2px' }} />
            ) : null}
          </div>
        </Typography>
      </div>
    );
  };

  const handleChangeMessage = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setMessage(e?.target?.value);
  };

  const handleSendMessage = () => {
    if (!message) return;
    const timestamp = Date.now();
    setMessagesQueue((prev: any) => [
      ...prev,
      {
        timestamp,
        message,
      },
    ]);
    setMessage('');
    newChat({
      variables: {
        channelId,
        message,
        status: 'sent',
        sentByUserId: _id,
        sentToUserId: friendId,
        timestamp,
      },
    });
  };

  return (
    <ChatMessagesStyled>
      {loadingQuery && null}
      {!loadingQuery && (messageGroups?.length || messagesQueue.length) ? (
        <div className="chat-wrapper">
          {messageGroups?.map((messageGroup: any) => (
            <Grid
              container
              spacing={2}
              justifyContent={
                messageGroup?.side === 'right' ? 'flex-end' : 'flex-start'
              }
            >
              {messageGroup?.side === 'left' && (
                <Grid item>
                  <Avatar className="avatar" src={friendAvatarSrc} />
                </Grid>
              )}
              <Grid item xs={8}>
                {messageGroup?.data?.length
                  ? messageGroup?.data?.map((msg: any, index: number) =>
                      renderChat(
                        msg,
                        index,
                        messageGroup?.data,
                        messageGroup?.side,
                      ),
                    )
                  : null}
              </Grid>
            </Grid>
          ))}
          {messagesQueue?.map((messageQueue: any, i: number) => {
            const msgHeight2 = heights2?.length
              ? heights2?.find(
                  (el: any) => el?.msgTimestamp === messageQueue?.timestamp,
                )?.height || 0
              : 0;
            return (
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item xs={8}>
                  <div
                    className="rightRow"
                    key={messageQueue?.timestamp}
                    ref={ref2}
                  >
                    <Typography
                      align="left"
                      className="msg right"
                      sx={{
                        gap: msgHeight2 > 50 ? '' : '1.2rem',
                        alignItems: msgHeight2 > 50 ? 'flex-start' : 'center',
                        flexDirection: msgHeight2 > 50 ? 'column' : 'row',
                      }}
                    >
                      {messageQueue?.message}
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.2rem',
                          marginTop: '0.875rem',
                          alignItems: 'center',
                          alignSelf: 'flex-end',
                        }}
                      >
                        {messageQueue?.timestamp ? (
                          <Typography variant="caption">
                            {getTime(messageQueue?.timestamp)}
                          </Typography>
                        ) : null}
                        <AccessTimeIcon sx={{ fontSize: 14, p: '3px' }} />
                      </div>
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            );
          })}
          <div ref={scrollRef} />
        </div>
      ) : (
        <div className="no-messages-wrapper">
          {!loadingQuery && !messagesQueue?.length ? 'No Messages' : null}
        </div>
      )}
      <TextField
        fullWidth
        value={message}
        onKeyUp={(_: any) => handleKeyPress(_, handleSendMessage)}
        onChange={handleChangeMessage}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSendMessage}>
                <SendIcon color="info" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </ChatMessagesStyled>
  );
};

export default ChatMessages;
