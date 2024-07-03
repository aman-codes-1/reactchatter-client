import {
  ChangeEvent,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from 'react-router-dom';
import { Grid, IconButton, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DoneIcon from '@mui/icons-material/Done';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Avatar } from '../../../components';
import {
  MESSAGES_QUERY,
  useAuth,
  useMessages,
  useResize,
} from '../../../hooks';
import { ChatsAndFriendsContext } from '../../../contexts';
import { getTime, handleKeyPress } from '../../../helpers';
import { ChatMessagesStyled } from './ChatMessages.styled';

const ChatMessages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navbarHeight] = useOutletContext<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId = searchParams.get('id');
  const [message, setMessage] = useState('');
  const [messagesQueue, setMessagesQueue] = useState<any[]>([]);
  const [heights, setHeights] = useState<any[]>([]);
  const [heights2, setHeights2] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [textFieldHeight, setTextFieldHeight] = useState(0);
  const { height, width } = useResize();
  const { auth: { _id = '' } = {} } = useAuth();
  const {
    chats = [],
    chatError,
    createChat,
    selectedFriend,
    activeMember,
  } = useContext(ChatsAndFriendsContext);
  const { _id: friendId = '' } = selectedFriend || {};
  const {
    createMessage,
    client,
    messagesData,
    loadingMessages,
    messages,
    setMessages,
    messageGroups,
    setMessageGroups,
    messagesWithQueue,
  } = useMessages(chatId, setMessagesQueue);
  const scrollRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const textFieldRef = useRef<any>(null);

  const setFocus = () => inputRef?.current && inputRef?.current?.focus();
  setFocus();

  const useArrayRef = () => {
    const refs: any[] = [];
    return [refs, (el: any) => el && refs.push(el)];
  };

  const [elements, ref]: any = useArrayRef();
  const [elements2, ref2]: any = useArrayRef();

  const resetAllStates = () => {
    setMessages([]);
    setMessageGroups([]);
    setMessage('');
    setMessagesQueue([]);
    setHeights([]);
    setHeights2([]);
    setLoading(false);
  };

  if (chatError) {
    navigate('/');
  }

  useLayoutEffect(() => {
    setTextFieldHeight(textFieldRef?.current?.clientHeight);
  }, []);

  useLayoutEffect(() => {
    if ((chatId && !chats?.length) || (!selectedFriend && !chatId)) {
      navigate('/');
    }
  }, [chatId, chats, selectedFriend, navigate]);

  useLayoutEffect(() => {
    if ((selectedFriend && !chatId) || chatId) {
      resetAllStates();
    }
  }, [selectedFriend, chatId]);

  useLayoutEffect(() => {
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
    if (chatId) {
      getCachedData();
    }
  }, [messagesData, chatId]);

  useLayoutEffect(() => {
    const checkDimensions = () => {
      setHeights([]);
      setHeights(
        elements.map((element: any, idx: number) => ({
          msgId: messages?.[idx]?._id,
          height: element?.clientHeight,
        })),
      );
    };
    if (messages?.length) {
      checkDimensions();
    }
    const listRefObserver = new MutationObserver(checkDimensions);
    const listElement = ref?.current;
    if (listElement) {
      listRefObserver?.observe(listElement, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
    return () => {
      listRefObserver?.disconnect();
    };
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
    const scrollElement = scrollRef?.current;
    if (scrollElement) {
      scrollElement?.scrollIntoView();
    }
  }, [
    heights,
    heights2,
    messageGroups,
    messagesQueue,
    width,
    height,
    location?.state?.isListItemClicked,
  ]);

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
          friendUserId: activeMember?._id,
        },
      });
      const newChatId = res?.data?.createChat?._id;
      if (newChatId) {
        await createMessage({
          variables: {
            chatId: newChatId,
            message,
            senderId: _id,
            timestamp,
          },
        });
        setSearchParams((params) => {
          params.set('id', newChatId);
          return params;
        });
      }
    }
    if (chatId) {
      await createMessage({
        variables: {
          chatId,
          message,
          senderId: _id,
          timestamp,
        },
      });
    }
  };

  const attachClass = (data: any, index: number, side: string) => {
    if (index === 0) {
      return `${side}First`;
    }
    if (data && Array.isArray(data) && index === data.length - 1) {
      return `${side}Last`;
    }
    return '';
  };

  const renderChat = (msg: any, index: number, data: any, side: string) => {
    const msgHeight = heights?.length
      ? heights?.find((el: any) => el?.msgId === msg?._id)?.height || 0
      : 0;
    return (
      <div className={`${side}Row`} key={msg?._id} ref={ref}>
        <Typography
          align="left"
          className={`msg ${side} ${attachClass(data, index, side)}`}
          // sx={{
          //   gap: msgHeight > 50 ? '' : '1.2rem',
          //   alignItems: msgHeight > 50 ? 'flex-start' : 'center',
          //   flexDirection: msgHeight > 50 ? 'column' : 'row',
          // }}
          sx={{
            gap: '1.2rem',
            alignItems: 'center',
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
            {side === 'right' ? (
              <>
                {msg?.sender?.sentStatus?.isSent === true ? (
                  <DoneIcon sx={{ fontSize: 16, p: '0px 2px' }} />
                ) : null}
                {msg?.receiver?.readStatus?.isRead === true ? (
                  <DoneAllIcon sx={{ fontSize: 16, p: '0px 2px' }} />
                ) : null}
              </>
            ) : null}
          </div>
        </Typography>
      </div>
    );
  };

  return (
    <ChatMessagesStyled
      navbarHeight={navbarHeight}
      textFieldHeight={textFieldHeight}
    >
      <div className="chat-container">
        {(loadingMessages || loading) && null}
        {!loadingMessages &&
        !loading &&
        !(messageGroups?.length || messagesQueue?.length) ? (
          <div className="no-messages-wrapper">No Messages</div>
        ) : null}
        {!loadingMessages &&
        !loading &&
        (messageGroups?.length || messagesQueue?.length) ? (
          <div className="chat-wrapper">
            {messageGroups?.map((messageGroup: any, idx: number) => (
              <Grid
                container
                spacing={2}
                justifyContent={
                  messageGroup?.side === 'right' ? 'flex-end' : 'flex-start'
                }
                alignItems="flex-end"
                key={`${JSON.stringify(messageGroup)} ${idx}`}
              >
                {messageGroup?.side === 'left' && (
                  <Grid item>
                    <Avatar src="" width={32} height={32} />
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
            {messagesQueue?.map((messageQueue: any, idx: number) => {
              const msgHeight2 = heights2?.length
                ? heights2?.find(
                    (el: any) => el?.msgTimestamp === messageQueue?.timestamp,
                  )?.height || 0
                : 0;
              return (
                <Grid
                  container
                  spacing={2}
                  justifyContent="flex-end"
                  key={`${JSON.stringify(messageQueue)} ${idx}`}
                >
                  <Grid item xs={8}>
                    <div className="rightRow" ref={ref2}>
                      <Typography
                        align="left"
                        className="msg right"
                        // sx={{
                        //   gap: msgHeight2 > 50 ? '' : '1.2rem',
                        //   alignItems: msgHeight2 > 50 ? 'flex-start' : 'center',
                        //   flexDirection: msgHeight2 > 50 ? 'column' : 'row',
                        // }}
                        sx={{
                          gap: '1.2rem',
                          alignItems: 'center',
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
      </div>
      <div className="text-field-wrapper" ref={textFieldRef}>
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
          size="medium"
        />
        {message ? (
          <IconButton onClick={handleSendMessage}>
            <SendIcon color="info" />
          </IconButton>
        ) : null}
      </div>
    </ChatMessagesStyled>
  );
};

export default ChatMessages;
