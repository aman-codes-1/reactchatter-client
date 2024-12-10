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
  ChatsAndFriendsContext,
  MESSAGE_GROUPS_QUERY,
} from '../../../contexts';
import {
  addObject,
  deleteKeyValuePairs,
  deleteObject,
  findAndMoveToTop,
  findAndUpdate,
  getOtherMembers,
  getSender,
  groupMessage,
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

const Chats = () => {
  const MessageQueue = new MessageQueueService();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [navbarHeight, sideBarWidth] = useOutletContext<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId =
    searchParams.get('type') === 'chat' ? searchParams.get('id') : null;
  const friendId =
    searchParams.get('type') === 'friend' ? searchParams.get('id') : null;
  const [message, setMessage] = useState('');
  const [appBarHeight, setAppBarHeight] = useState(0);
  const [textFieldHeight, setTextFieldHeight] = useState(0);
  const { auth: { _id = '' } = {} } = useAuth();
  const {
    chatLoading,
    chatCalled,
    friendLoading,
    friendCalled,
    messageGroups = [],
    messageGroupsPageInfo,
    messageGroupsQueuedPageInfo,
    messageGroupsClient,
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
  const inputRef = useRef<any>(null);
  const appBarRef = useRef<any>(null);
  const textFieldRef = useRef<any>(null);

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
  }, [chatId, friendId]);

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

  const addUpdateChat = (
    dataToUpdate: any,
    updateKey: string,
    selectedEl?: any,
    id?: string,
    key?: string,
  ) => {
    let idx = -1;
    let isChatAdded = false;
    let isChatUpdated = false;

    chatsClient.cache.modify({
      fields: {
        [`chats({"input":{"userId":"${_id}"}})`](existingData: any) {
          if (selectedEl) {
            const chat = {
              ...selectedEl,
              [updateKey]: dataToUpdate,
            };
            const newData = addObject(chat, existingData);
            isChatAdded = true;
            return newData;
          }
          if (id && key) {
            const { isFoundAndUpdated, data, index } = findAndUpdate(
              id,
              key,
              existingData,
              dataToUpdate,
              updateKey,
            );
            idx = index;
            if (isFoundAndUpdated && data?.length) {
              isChatUpdated = true;
              return data;
            }
          }
          return existingData;
        },
      },
    });

    if (idx > 0 && id && key) {
      setTimeout(() => {
        chatsClient.cache.modify({
          fields: {
            [`chats({"input":{"userId":"${_id}"}})`](existingData: any) {
              const data = findAndMoveToTop(id, key, existingData);
              return data;
            },
          },
        });
      }, 200);
    }

    return {
      isChatAdded,
      isChatUpdated,
    };
  };

  const deleteFriend = (id: string) => {
    otherFriendsClient.cache.modify({
      fields: {
        [`otherFriends({"input":{"userId":"${_id}"}})`](existingData: any) {
          const data = deleteObject(id, existingData);
          return data;
        },
      },
    });
  };

  const renderMessage = (queuedMessage: any, id: string) => {
    const edges = groupMessage(messageGroups, queuedMessage, _id);
    const pageInfo = {
      endCursor: '',
      hasNextPage: false,
    };

    messageGroupsClient.writeQuery({
      query: MESSAGE_GROUPS_QUERY,
      data: {
        messageGroups: {
          edges,
          pageInfo: messageGroupsPageInfo?.endCursor
            ? messageGroupsPageInfo
            : pageInfo,
          queuedPageInfo: messageGroupsQueuedPageInfo?.endCursor
            ? messageGroupsQueuedPageInfo
            : pageInfo,
          scrollPosition: -1,
        },
      },
      variables: { chatId: id },
    });

    setScrollToBottom((prev: boolean) => !prev);
  };

  const handleSendMessage = async () => {
    if (!message) return;
    setMessage('');
    setLoadingCreateMessage(true);

    try {
      const queueId = crypto.randomUUID();
      const timestamp = Date.now();
      let chatIdToUse = chatId || '';
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

      if (!chatIdToUse && friendId) {
        queuedMessage = {
          ...queuedMessageData,
          chatId: '',
          friendId,
          friendUserId: selectedDetails?._id,
        };

        renderMessage(queuedMessage, friendId);

        deleteFriend(friendId);

        const chat = {
          ...selectedItem,
          hasChats: true,
          queueId,
        };

        const { isChatAdded } = addUpdateChat(
          queuedMessage,
          'lastMessage',
          chat,
        );

        isChatDone = isChatAdded;

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

        const createdChat = await createChat({
          variables: {
            userId: _id,
            queueId,
            type: 'private',
            friendIds: [queuedMessage?.friendId],
            friendUserIds: [queuedMessage?.friendUserId],
          },
        });

        const createdChatData = createdChat?.data?.createChat;
        const createdChatId = createdChatData?._id;
        if (!createdChatId) throw new Error('Failed to create chat');
        chatIdToUse = createdChatId;

        addUpdateChat(chatIdToUse, '_id', undefined, friendId, '_id');

        const newData = {
          chatId: chatIdToUse,
        };

        const updatedQueuedMessage = await MessageQueue.updateMessageToQueue(
          queueId,
          newData,
          ['chatId', 'friendId', 'friendUserId'],
        ).catch((err) => {
          console.error('Error updating to queue:', err);
          return null;
        });

        if (updatedQueuedMessage) {
          queuedMessage = updatedQueuedMessage;
          isUpdated = true;
        }

        if (!isUpdated) {
          queuedMessage = deleteKeyValuePairs(queuedMessage, [
            'chatId',
            'friendId',
            'friendUserId',
          ]);
          queuedMessage = {
            ...queuedMessage,
            ...newData,
          };
        }
      }

      if (chatIdToUse) {
        queuedMessage = queuedMessage || {
          ...queuedMessageData,
          chatId: chatIdToUse,
        };

        renderMessage(queuedMessage, chatIdToUse);

        setSearchParams((params) => {
          params.set('id', chatIdToUse);
          params.set('type', 'chat');
          return params;
        });

        if (!isChatDone) {
          addUpdateChat(
            queuedMessage,
            'lastMessage',
            undefined,
            chatIdToUse,
            '_id',
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
        if (!createdMessageId) throw new Error('Failed to create message');

        const createdMessageQueueId = createdMessageData?.queueId;
        if (createdMessageQueueId) {
          await MessageQueue.deleteMessageFromQueue(createdMessageQueueId);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoadingCreateMessage(false);
    }
  };

  const loading = chatLoading || chatCalled || friendLoading || friendCalled;

  const renderSecondary = () => {
    const onlineStatus = selectedDetails?.onlineStatus;
    if (onlineStatus) {
      const isOnline = onlineStatus?.isOnline;
      const lastSeen = onlineStatus?.lastSeen;
      if (isOnline) {
        return 'online';
      }
      if (!isOnline && lastSeen) {
        // to do: show time label
        return lastSeen;
      }
      return selectedDetails?.email;
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
                      primaryTypographyProps: {
                        style: {
                          WebkitLineClamp: 1,
                        },
                      },
                      secondaryTypographyProps: {
                        style: {
                          WebkitLineClamp: 1,
                        },
                      },
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
