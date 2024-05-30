import {
  ChangeEvent,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Avatar, Grid, IconButton, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DoneIcon from '@mui/icons-material/Done';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import {
  MESSAGES_QUERY,
  useAuth,
  useMessages,
  useResize,
} from '../../../hooks';
import { getTime, handleKeyPress } from '../../../helpers';
import { ChatMessagesStyled } from './ChatMessages.styled';
import { ChatsAndFriendsContext } from '../../../contexts';

const ChatMessages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId = searchParams.get('id');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messagesQueue, setMessagesQueue] = useState<any[]>([]);
  const [heights, setHeights] = useState<any[]>([]);
  const [heights2, setHeights2] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { height, width } = useResize();
  const { auth: { _id = '' } = {} } = useAuth();
  const {
    createChat,
    friendDetails,
    chats = [],
  } = useContext(ChatsAndFriendsContext);
  const { _id: friendId = '', otherFriend = {} } = friendDetails || {};
  const {
    getMessages,
    // createMessage,
    client,
    messagesData,
    loadingMessages,
    messages,
    messageGroups,
    messagesWithQueue,
  } = useMessages(friendId, setMessagesQueue);
  const scrollRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  const setFocus = () => inputRef?.current && inputRef?.current?.focus();
  setFocus();

  const useArrayRef = () => {
    const refs: any[] = [];
    return [refs, (el: any) => el && refs.push(el)];
  };

  const [elements, ref]: any = useArrayRef();
  const [elements2, ref2]: any = useArrayRef();

  const resetAllStates = () => {
    setMessage('');
    setMessagesQueue([]);
    setHeights([]);
    setHeights2([]);
    setLoading(false);
  };

  useLayoutEffect(() => {
    if ((chatId && !chats?.length) || (!friendDetails && !chatId)) {
      navigate('/');
    }
  }, [chatId, chats, friendDetails]);

  useLayoutEffect(() => {
    const fetchMessages = async () => {
      await getMessages({
        variables: {
          chatId,
        },
      });
    };
    if (chatId) {
      resetAllStates();
      fetchMessages();
    }
  }, [chatId]);

  const getCachedData = async () => {
    setLoading(true);
    const cachedData = await client?.readQuery({
      query: MESSAGES_QUERY,
      variables: {
        chatId,
      },
    });
    if (!cachedData) {
      messagesWithQueue(messagesData?.messages);
      setLoading(false);
    } else {
      messagesWithQueue(cachedData?.messages);
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (chatId) {
      getCachedData();
    }
  }, [messagesData, chatId]);

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
    if (friendId) {
      const res = await createChat({
        variables: {
          userId: _id,
          friendId,
          type: 'private',
          friendUserId: otherFriend?._id,
        },
      });
      const newChatId = res?.data?.createChat?._id;
      if (newChatId) {
        setSearchParams((params) => {
          params.set('id', newChatId);
          return params;
        });
      }
    }
    if (chatId) {
      // await createMessage({
      //   variables: {
      //     chatId,
      //     message,
      //     senderId: _id,
      //     isSent: true,
      //     sentTimestamp: timestamp,
      //     receiverId: '',
      //   },
      // });
    }
  };

  const attachClass = (msgGroup: any, index: number, side: string) => {
    if (index === 0) {
      return `${side}First`;
    }
    if (msgGroup && Array.isArray(msgGroup) && index === msgGroup.length - 1) {
      return `${side}Last`;
    }
    return '';
  };

  const renderChat = (msg: any, index: number, msgGroup: any, side: string) => {
    const msgHeight = heights?.length
      ? heights?.find((el: any) => el?.msgId === msg?._id)?.height || 0
      : 0;
    return (
      <div className={`${side}Row`} key={msg?._id} ref={ref}>
        <Typography
          align="left"
          className={`msg ${side} ${attachClass(msgGroup, index, side)}`}
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
        {loadingMessages && loading && null}
        {!loadingMessages &&
        !loading &&
        !(messageGroups?.length || messagesQueue.length) ? (
          <div className="no-messages-wrapper">No Messages</div>
        ) : null}
        {!loadingMessages &&
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
                    <Avatar className="avatar" src="" />
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
                          <AccessTimeIcon
                            sx={{ fontSize: 14, p: '0px 2.6px' }}
                          />
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
        <div className="text-field-wrapper">
          <TextField
            autoFocus
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
              className={!message ? 'send-icon-disabled' : ''}
            />
          </IconButton>
        </div>
      </div>
    </ChatMessagesStyled>
  );
};

export default ChatMessages;
