import {
  ChangeEvent,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AppBar, IconButton, List, TextField, Toolbar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { ListItem, MainLayoutLoader } from '../../../components';
import { useAuth } from '../../../hooks';
import { ChatsAndFriendsContext, DrawerContext } from '../../../contexts';
import {
  addUpdateChat,
  deleteFriend,
  deleteFriendsCachedMessages,
  getDateLabel2,
  getFriendId,
  getOtherMembers,
  getSender,
  getTime,
  handleKeyPress,
  renderMessage,
  setFocus,
  updateHeight,
  validateSearchParams,
} from '../../../helpers';
import { MessageQueueService } from '../../../services';
import ChatGroups from './ChatGroups';
import { ChatsStyled } from './Chats.styled';

const Chats = () => {
  const MessageQueue = new MessageQueueService();
  const navigate = useNavigate();
  const { search } = useLocation();
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
    userOnlineStatus,
    userOnlineStatusLoading,
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
  const { navbarHeight, sideBarWidth } = useContext(DrawerContext);
  console.log(sideBarWidth);
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
      let isRenderedChatMessage = false;

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

        await renderMessage(
          cachedMessagesClient,
          queuedMessage,
          fullFriendId,
          setScrollToBottom,
        );

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

        const { isRendered } = await renderMessage(
          cachedMessagesClient,
          queuedMessage,
          createdChatId,
        );
        isRenderedChatMessage = isRendered;

        deleteFriendsCachedMessages(cachedMessagesClient, fullFriendId);

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

        if (
          friendId &&
          friendIdToUse &&
          chatIdToUse &&
          friendId === friendIdToUse
        ) {
          setSearchParams(
            (params) => {
              params.set('id', chatIdToUse);
              params.set('type', 'chat');
              return params;
            },
            { replace: true },
          );
        }

        setLoadingCreateChat(false);
      }

      if (chatIdToUse) {
        queuedMessage = queuedMessage || {
          ...queuedMessageData,
          chatId: chatIdToUse,
        };

        if (!isRenderedChatMessage) {
          await renderMessage(
            cachedMessagesClient,
            queuedMessage,
            chatIdToUse,
            setScrollToBottom,
          );
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
    if (userOnlineStatusLoading) return '';
    const onlineStatus = userOnlineStatus?.userOnlineStatus?.onlineStatus;
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

  const handleClickBack = () => {
    navigate(-1);
  };

  return (
    <ChatsStyled
      navbarHeight={navbarHeight}
      sideBarWidth={sideBarWidth}
      message={message}
    >
      <div className="app-bar-wrapper">
        <AppBar position="static" className="app-bar" ref={appBarRef}>
          <Toolbar className="tool-bar">
            <div className="top-app-bar">
              <IconButton
                size="small"
                className="top-bar-back-btn"
                onClick={handleClickBack}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
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
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <ChatGroups
        appBarHeight={appBarHeight}
        textFieldHeight={textFieldHeight}
      />
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
