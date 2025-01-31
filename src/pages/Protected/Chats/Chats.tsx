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
import { AppBar, IconButton, List, TextField, Toolbar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../../../hooks';
import {
  CACHED_MESSAGES_QUERY,
  ChatsAndFriendsContext,
} from '../../../contexts';
import {
  addObject,
  addUpdateChat,
  deleteFriend,
  getDateLabel2,
  getFriendId,
  getOtherMembers,
  getSender,
  getTime,
  handleKeyPress,
  setFocus,
  updateHeight,
  validateSearchParams,
} from '../../../helpers';
import { ListItem } from '../../../components';
import { MessageQueueService } from '../../../services';
import { MainLayoutLoader } from '../components';
import ChatGroups from './ChatGroups';
import { ChatsStyled } from './Chats.styled';

const Chats = ({ loadingChats }: any) => {
  const MessageQueue = new MessageQueueService();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [navbarHeight, sideBarWidth] = useOutletContext<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId =
    searchParams.get('type') === 'chat' ? searchParams.get('id') : null;
  const fullFriendId =
    searchParams.get('type') === 'friend' ? searchParams.get('id') : null;
  const { friendId, friendUserId } = getFriendId(fullFriendId);
  const [message, setMessage] = useState('');
  const [appBarHeight, setAppBarHeight] = useState(0);
  const [textFieldHeight, setTextFieldHeight] = useState(0);
  const [loadingCreateChat, setLoadingCreateChat] = useState(false);
  const { auth: { _id = '' } = {} } = useAuth();
  const {
    chatLoading,
    chatCalled,
    friendLoading,
    friendCalled,
    cachedMessagesClient,
    messages = [],
    messagesPageInfo,
    messagesIsFetched,
    activeClients,
    activeClientsLoading,
    chatsClient,
    otherFriendsClient,
    createMessage,
    createChat,
    isListItemClicked,
    selectedItem,
    selectedDetails,
    setLoadingCreateMessage,
    setScrollToBottom,
  } = useContext(ChatsAndFriendsContext);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const appBarRef = useRef<HTMLElement | null>(null);
  const textFieldRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    setFocus(inputRef);
  }, [isListItemClicked]);

  useLayoutEffect(() => {
    updateHeight(appBarRef, setAppBarHeight);
    window.addEventListener('resize', () =>
      updateHeight(appBarRef, setAppBarHeight),
    );

    return () => {
      window.removeEventListener('resize', () =>
        updateHeight(appBarRef, setAppBarHeight),
      );
    };
  }, []);

  useLayoutEffect(() => {
    updateHeight(textFieldRef, setTextFieldHeight);
    window.addEventListener('resize', () =>
      updateHeight(textFieldRef, setTextFieldHeight),
    );

    return () => {
      window.removeEventListener('resize', () =>
        updateHeight(textFieldRef, setTextFieldHeight),
      );
    };
  }, []);

  const resetAllStates = () => {
    setMessage('');
  };

  useLayoutEffect(() => {
    resetAllStates();
  }, [chatId, fullFriendId]);

  useLayoutEffect(() => {
    try {
      const isValid = validateSearchParams(search);
      if (!isValid) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error getting url:', error);
    }
  }, [search]);

  const handleChangeMessage = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setMessage(e?.target?.value);
  };

  const renderMessage = (queuedMessage: any, id: string) => {
    const edges = addObject(queuedMessage, messages);
    let pageInfo = {
      endCursor: '',
      hasPreviousPage: false,
      hasNextPage: false,
    };
    pageInfo = messagesPageInfo?.endCursor ? messagesPageInfo : pageInfo;
    const scrollPosition = 0;
    const isFetched = messagesIsFetched;

    cachedMessagesClient.writeQuery({
      query: CACHED_MESSAGES_QUERY,
      data: {
        cachedMessages: {
          edges,
          pageInfo,
          scrollPosition,
          isFetched,
        },
      },
      variables: { chatId: id },
    });

    setScrollToBottom((prev: boolean) => !prev);
  };

  const handleSendMessage = async () => {
    if (!message || loadingCreateChat) return;
    setMessage('');
    setLoadingCreateMessage(true);

    try {
      const queueId = crypto.randomUUID();
      const timestamp = Date.now();
      let chatIdToUse = chatId || '';
      let friendIdToUse = friendId || '';
      let queuedMessage: any;
      let isAdded = false;
      let isUpdated = false;
      let isChatDone = false;

      const queuedMessageData = {
        _id: '',
        queueId,
        message,
        timestamp,
        otherMembers: getOtherMembers(selectedItem?.members, _id),
        sender: getSender(selectedItem?.members, timestamp, _id),
      };

      if (!chatIdToUse && fullFriendId) {
        setLoadingCreateChat(true);

        queuedMessage = {
          ...queuedMessageData,
          chatId: fullFriendId,
        };

        renderMessage(queuedMessage, fullFriendId);

        deleteFriend(otherFriendsClient, _id, friendIdToUse);

        const friend = {
          ...selectedItem,
          hasChats: true,
          lastMessage: queuedMessage,
        };

        const { isChatAdded, isChatUpdated } = addUpdateChat(
          chatsClient,
          _id,
          friendIdToUse,
          '_id',
          friend,
          undefined,
          true,
        );

        isChatDone = isChatAdded || isChatUpdated;

        const addedQueuedMessage = await MessageQueue.addMessageToQueue(
          queuedMessage,
        ).catch((err) => {
          console.error('Error adding to queue:', err);
          return null;
        });

        if (addedQueuedMessage) {
          queuedMessage = addedQueuedMessage;
          isAdded = true;
        }

        const newChat = await createChat({
          variables: {
            userId: _id,
            type: 'private',
            friendIds: [friendIdToUse],
            friendUserIds: [friendUserId],
          },
        });

        const createdChatData = newChat?.data?.createChat;
        const createdChatIsAlreadyCreated = createdChatData?.isAlreadyCreated;
        const createdChat = createdChatData?.chat;
        const createdChatId = createdChat?._id;
        const createdChatFriends = createdChat?.friends;
        const createdChatFriendId = createdChatFriends?.[0]?._id;

        if (!createdChatId || !createdChatFriendId)
          throw new Error('Failed to create chat');

        chatIdToUse = createdChatId;
        friendIdToUse = createdChatFriendId;

        const chatData = {
          ...createdChat,
          lastMessage: queuedMessage,
        };

        if (createdChatIsAlreadyCreated) {
          addUpdateChat(chatsClient, _id, chatIdToUse, '_id', chatData);
        } else {
          addUpdateChat(chatsClient, _id, friendIdToUse, '_id', chatData);
        }

        const newData = {
          chatId: chatIdToUse,
        };

        const updatedQueuedMessage = await MessageQueue.updateMessageToQueue(
          queueId,
          newData,
        ).catch((err) => {
          console.error('Error updating to queue:', err);
          return null;
        });

        if (updatedQueuedMessage) {
          queuedMessage = updatedQueuedMessage;
          isUpdated = true;
        }

        if (!isUpdated) {
          queuedMessage = {
            ...queuedMessage,
            ...newData,
          };
        }

        setLoadingCreateChat(false);
      }

      if (chatIdToUse) {
        queuedMessage = queuedMessage || {
          ...queuedMessageData,
          chatId: chatIdToUse,
        };

        renderMessage(queuedMessage, chatIdToUse);

        if (
          friendId &&
          friendIdToUse &&
          chatIdToUse &&
          friendId === friendIdToUse
        ) {
          setSearchParams((params) => {
            params.set('id', chatIdToUse);
            params.set('type', 'chat');
            return params;
          });
        }

        if (!isChatDone) {
          addUpdateChat(
            chatsClient,
            _id,
            chatIdToUse,
            '_id',
            queuedMessage,
            'lastMessage',
            true,
          );
        }

        if (!isAdded) {
          const addedQueuedMessage = await MessageQueue.addMessageToQueue(
            queuedMessage,
          ).catch((err) => {
            console.error('Error adding to queue:', err);
            return null;
          });

          if (addedQueuedMessage) {
            queuedMessage = addedQueuedMessage;
          }
        }

        const queuedMessageSender = queuedMessage?.sender;
        const queuedMessageQueuedStatus = queuedMessageSender?.queuedStatus;
        const queuedMessageQueuedStatusIsQueued =
          queuedMessageQueuedStatus?.isQueued || true;
        const queuedMessageQueuedStatusTimestamp =
          queuedMessageQueuedStatus?.timestamp || timestamp;

        const createdMessage = await createMessage({
          variables: {
            userId: _id,
            chatId: chatIdToUse,
            queueId,
            isQueued: queuedMessageQueuedStatusIsQueued,
            queuedTimestamp: queuedMessageQueuedStatusTimestamp,
            isSent: true,
            sentTimestamp: Date.now(),
            message,
          },
        });

        const createdMessageData = createdMessage?.data?.createMessage;
        const createdMessageId = createdMessageData?._id;
        const createdMessageQueueId = createdMessageData?.queueId;
        if (!createdMessageId) throw new Error('Failed to create message');

        if (createdMessageQueueId) {
          await MessageQueue.deleteMessageFromQueue(createdMessageQueueId);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoadingCreateChat(false);
      setLoadingCreateMessage(false);
    }
  };

  const loading = chatLoading || chatCalled || friendLoading || friendCalled;

  const renderSecondary = () => {
    if (activeClientsLoading) return '';
    const onlineStatus = activeClients?.activeClients?.onlineStatus;
    if (onlineStatus) {
      const isOnline = onlineStatus?.isOnline;
      const lastSeen = onlineStatus?.lastSeen;
      if (isOnline) {
        return 'online';
      }
      if (!isOnline && lastSeen) {
        const lastSeenStr = `last seen ${getDateLabel2(lastSeen)} at ${getTime(lastSeen)}`;
        return lastSeenStr;
      }
    }
    return selectedDetails?.email;
  };

  return (
    <ChatsStyled
      navbarHeight={navbarHeight}
      sideBarWidth={sideBarWidth}
      message={message}
    >
      <div className="app-bar-wrapper">
        <AppBar position="static" className="app-bar" ref={appBarRef}>
          <Toolbar>
            {loading ? (
              <MainLayoutLoader dense disablePadding disableGutters />
            ) : (
              <List dense disablePadding>
                <ListItem
                  disablePadding
                  disableGutters
                  disableHover
                  btnProps={{
                    disableGutters: true,
                    textProps: {
                      primary: selectedDetails?.name,
                      secondary: renderSecondary(),
                    },
                    style: {
                      WebkitLineClamp: 1,
                    },
                    avatarProps: {
                      src: selectedDetails?.picture,
                    },
                  }}
                />
              </List>
            )}
          </Toolbar>
        </AppBar>
      </div>
      {loadingChats ? null : (
        <ChatGroups
          appBarHeight={appBarHeight}
          textFieldHeight={textFieldHeight}
        />
      )}
      <div className="text-field-wrapper" ref={textFieldRef}>
        <AppBar position="static" className="app-bar text-field-app-bar">
          <Toolbar disableGutters variant="dense">
            <div className="text-field-input-wrapper">
              <TextField
                autoFocus
                fullWidth
                value={message}
                onKeyUp={(_: any) => handleKeyPress(_, handleSendMessage)}
                onChange={handleChangeMessage}
                slotProps={{
                  input: {
                    className: 'text-field-input',
                  },
                }}
                placeholder=" Type a message"
                inputRef={inputRef}
              />
              {message ? (
                <IconButton onClick={handleSendMessage}>
                  <SendIcon color="info" />
                </IconButton>
              ) : null}
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </ChatsStyled>
  );
};

export default Chats;
