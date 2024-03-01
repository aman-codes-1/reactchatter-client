import {
  ChangeEvent,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Grid, IconButton, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DoneIcon from '@mui/icons-material/Done';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { FriendsContext } from '../../../../../contexts';
import { useAuth, useChats, useResize } from '../../../../../hooks';
import { getTime, handleKeyPress } from '../../../../../helpers';
import { ChatMessagesStyled } from './ChatMessages.styled';
import { CHATS_QUERY } from '../../../../../hooks/useChats/gql';

const ChatMessages = () => {
  console.log('here');
  const params = useParams();
  const navigate = useNavigate();
  const { auth: { _id = '' } = {} } = useAuth();
  const { state: { data = [] } = {} } = useContext(FriendsContext);
  const scrollRef = useRef<any>(null);
  const [message, setMessage] = useState('');
  const [messagesQueue, setMessagesQueue] = useState<any[]>([]);
  const [heights, setHeights] = useState<any[]>([]);
  const [heights2, setHeights2] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { height, width } = useResize();
  const id = params?.id;
  const friend = data?.length ? data?.find((el: any) => el?._id === id) : {};
  const friendId = friend?._id || '';
  const chattingWithFriendId = friend?.friendDetails?._id || '';
  const friendAvatarSrc = friend?.friendDetails?.picture || '';
  const {
    getChats,
    createChat,
    client,
    chatsData,
    loadingChatsQuery,
    messages,
    messageGroups,
    chatsWithQueue,
  } = useChats(friendId, setMessagesQueue);
  const inputRef = useRef<any>(null);
  const setFocus = () => inputRef?.current && inputRef?.current?.focus();
  setFocus();

  const useArrayRef = () => {
    const refs: any[] = [];
    return [refs, (el: any) => el && refs.push(el)];
  };

  const [elements, ref]: any = useArrayRef();
  const [elements2, ref2]: any = useArrayRef();

  if (!friendId) {
    navigate('/dashboard');
  }

  const fetchChats = async () => {
    await getChats({
      variables: {
        friendId,
      },
    });
  };

  useLayoutEffect(() => {
    if (friendId) {
      fetchChats();
    }
  }, [friendId]);

  const getCachedData = async () => {
    setLoading(true);
    const cachedData = await client?.readQuery({
      query: CHATS_QUERY,
      variables: {
        friendId,
      },
    });
    if (!cachedData) {
      chatsWithQueue(chatsData?.chats);
      setLoading(false);
    } else {
      chatsWithQueue(cachedData?.chats);
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    getCachedData();
  }, [chatsData, friendId]);

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
            {msg?.sender?.sentStatus?.timestamp ? (
              <Typography variant="caption">
                {getTime(msg?.sender?.sentStatus?.timestamp)}
              </Typography>
            ) : null}
            {side === 'right' && msg?.sender?.sentStatus?.isSent === true ? (
              <DoneIcon sx={{ fontSize: 16, p: '0px 2px' }} />
            ) : null}
            {side === 'right' && msg?.receiver?.readStatus?.isRead === true ? (
              <DoneAllIcon sx={{ fontSize: 16, p: '0px 2px' }} />
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

  const handleSendMessage = async () => {
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
    await createChat({
      variables: {
        friendId,
        message,
        senderId: _id,
        isSent: true,
        sentTimestamp: timestamp,
        receiverId: chattingWithFriendId,
      },
    });
  };

  return (
    <ChatMessagesStyled>
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <span />
        {loadingChatsQuery && loading && null}
        {!loadingChatsQuery &&
        !loading &&
        !(messageGroups?.length || messagesQueue.length) ? (
          <div className="no-messages-wrapper">No Messages</div>
        ) : null}
        {!loadingChatsQuery &&
        !loading &&
        (messageGroups?.length || messagesQueue.length) ? (
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
                            gap: '0.25rem',
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
                          <AccessTimeIcon sx={{ fontSize: 14, p: '0px 2.6px' }} />
                        </div>
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              );
            })}
            <div ref={scrollRef} />
          </div>
        ) : null}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            padding: '0.8rem 1rem 0.8rem 3.25rem',
            background: 'rgba(1, 150, 218, 0.08)',
          }}
        >
          <TextField
            fullWidth
            value={message}
            onKeyUp={(_: any) => handleKeyPress(_, handleSendMessage)}
            onChange={handleChangeMessage}
            InputProps={{
              style: {
                borderRadius: '10px',
                background: 'white',
                height: 44,
              },
            }}
            placeholder=" Type a message"
            inputRef={inputRef}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!message}
            disableFocusRipple
            disableRipple
            disableTouchRipple
          >
            <SendIcon
              color="info"
              sx={!message ? { color: 'rgba(1, 150, 218, 0)' } : {}}
            />
          </IconButton>
        </div>
      </div>
    </ChatMessagesStyled>
  );
};

export default ChatMessages;
