import {
  ChangeEvent,
  useContext,
  useEffect,
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
import { FriendsContext } from '../../../../../contexts';
import { useAuth, useChats } from '../../../../../hooks';
import { handleKeyPress } from '../../../../../helpers';
import { ChatMessagesStyled } from './ChatMessages.styled';

const ChatMessages = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { messageGroups: chatData } = state || {};
  const { auth: { _id = '' } = {} } = useAuth();
  const { state: { data = [] } = {} } = useContext(FriendsContext);
  const scrollRef = useRef<any>(null);
  const [message, setMessage] = useState('');
  const id = params?.id;
  const friend = data?.length ? data?.find((el: any) => el?._id === id) : {};
  const channelId = friend?._id || '';
  const friendId = friend?.friendDetails?._id || '';
  const friendAvatarSrc = friend?.friendDetails?.picture || '';
  const {
    getChats,
    loadingQuery,
    makeMessageGroups,
    messageGroups,
    setMessageGroups,
    newChat,
  } = useChats(channelId);

  useLayoutEffect(() => {
    setMessageGroups([]);
    if (chatData) {
      setMessageGroups(chatData);
    }
  }, [id]);

  useLayoutEffect(() => {
    if (
      (chatData && chatData?.length) ||
      (messageGroups && messageGroups?.length)
    ) {
      scrollRef?.current?.scrollIntoView({
        behavior: 'instant',
        block: 'end',
      });
    }
  }, [chatData, messageGroups]);

  const fetchChats = async () => {
    await getChats({
      variables: {
        channelId,
      },
      onCompleted: (res: any) => {
        const messageGroupsData = makeMessageGroups(res?.chats, _id);
        setMessageGroups(messageGroupsData);
      },
    });
  };

  useEffect(() => {
    if (
      window.performance.getEntriesByType('navigation')[0].type === 'reload' ||
      !chatData
    ) {
      fetchChats();
    }
  }, []);

  if (loadingQuery) {
    return null;
  }

  if (!channelId) {
    navigate('/dashboard');
  }

  const attachClass = (messages: any, index: number, side: string) => {
    if (index === 0) {
      return `${side}First`;
    }
    if (index === messages.length - 1) {
      return `${side}Last`;
    }
    return '';
  };

  const renderChat = (msg: any, messages: any, side: string, index: number) => (
    <div className={`${side}Row`} key={msg?._id}>
      <Typography
        align="left"
        className={`msg ${side} ${attachClass(messages, index, side)}`}
      >
        {msg?.message}
      </Typography>
    </div>
  );

  const handleChangeMessage = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setMessage(e?.target?.value);
  };

  const handleSendMessage = () => {
    if (!message) return;
    newChat({
      variables: {
        message,
        status: 'sent',
        channelId,
        sentByUserId: _id,
        sentToUserId: friendId,
      },
      onCompleted: () => {
        setMessage('');
      },
    });
  };

  return (
    <ChatMessagesStyled>
      {messageGroups?.length ? (
        <div className="chat-wrapper">
          {messageGroups.map((messages: any) => (
            <Grid
              container
              spacing={2}
              justifyContent={
                messages?.side === 'right' ? 'flex-end' : 'flex-start'
              }
            >
              {messages?.side === 'left' && (
                <Grid item>
                  <Avatar className="avatar" src={friendAvatarSrc} />
                </Grid>
              )}
              <Grid item xs={8}>
                {messages?.data?.length
                  ? messages?.data?.map((msg: any, index: number) =>
                      renderChat(msg, messages?.data, messages?.side, index),
                    )
                  : null}
              </Grid>
            </Grid>
          ))}
          <div ref={scrollRef} />
        </div>
      ) : (
        <div className="no-messages-wrapper">No Messages</div>
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
