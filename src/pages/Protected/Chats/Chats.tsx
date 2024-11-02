import {
  ChangeEvent,
  useContext,
  useEffect,
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
  MessagesContext,
} from '../../../contexts';
import {
  deleteKeyValuePairs,
  groupMessage,
  handleKeyPress,
  setFocus,
  updateHeight,
  validateSearchParams,
} from '../../../helpers';
import { ListItem } from '../../../components';
import { MainLayoutLoader } from '../components';
import { MessageQueueService } from '../../../services';
import ChatGroups from './ChatGroups';
import { ChatsStyled } from './Chats.styled';

const Chats = ({ loadingFallback }: any) => {
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
    chatQuery,
    chat,
    chatLoading,
    friendQuery,
    friendLoading,
    createChat,
    isListItemClicked,
    loadingQuery,
    setLoadingQuery,
    selectedItem,
  } = useContext(ChatsAndFriendsContext);
  const {
    messageGroups = [],
    messageGroupsPageInfo,
    messageGroupsQueuedPageInfo,
    messageGroupsClient,
    createMessage,
    setLoadingCreateMessage,
    setScrollToBottom,
    setQueuedMessages,
  } = useContext(MessagesContext);
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

  useLayoutEffect(() => {
    if (selectedItem?.hasChats === true) {
      navigate('/');
    }
  }, [selectedItem, isListItemClicked]);

  const fetchData = async (fetchFunction: any, id: string, key: string) => {
    try {
      const res = await fetchFunction({
        variables: {
          [key]: id,
          ...(key === 'friendId' ? { userId: _id } : {}),
        },
        fetchPolicy: 'no-cache',
      });

      const error = res?.error?.message;

      if (error) {
        navigate('/');
        throw new Error(error);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingQuery(false);
    }
  };

  useEffect(() => {
    if (loadingFallback || selectedItem) return;

    const fetchQuery = async () => {
      if (chatId) {
        await fetchData(chatQuery, chatId, 'chatId');
      }

      if (friendId) {
        await fetchData(friendQuery, friendId, 'friendId');
      }
    };

    fetchQuery();
  }, [loadingFallback, selectedItem]);

  const handleChangeMessage = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setMessage(e?.target?.value);
  };

  const getOtherMembers = (members: any[] = []) => {
    if (members?.length) {
      const otherMembers = members
        ?.filter((member: any) => member?._id !== _id)
        ?.map((member: any) => ({
          _id: member?._id,
          deliveredStatus: null,
          readStatus: null,
        }));

      return otherMembers;
    }

    return [];
  };

  const handleSendMessage = async () => {
    if (!message) return;

    setMessage('');
    const timestamp = Date.now();

    setLoadingCreateMessage(true);

    try {
      let chatIdToUse = chatId || '';
      let queuedMessage: any;
      let isAdded = false;
      let isUpdated = false;

      const queuedMessageData = {
        _id: '',
        queueId: crypto.randomUUID(),
        message,
        sender: {
          _id,
          retryStatus: null,
          queuedStatus: {
            isQueued: true,
            timestamp,
          },
          sentStatus: null,
        },
        timestamp,
      };

      if (!chatIdToUse && friendId) {
        queuedMessage = {
          friendId,
          friendUserId: selectedItem?.details?._id,
          ...queuedMessageData,
        };

        setQueuedMessages((prev: any) => {
          const prevCopy = [...prev];
          const friendIndex = prevCopy?.findIndex(
            (el: any) => el?.friendId === friendId,
          );

          if (friendIndex < 0) {
            const newMessageGroup = {
              friendId,
              messageGroups: groupMessage([], queuedMessage, _id),
            };

            prevCopy?.push(newMessageGroup);
          } else {
            const messageGroupsCopy = [...prevCopy[friendIndex].messageGroups];

            prevCopy[friendIndex] = {
              ...prevCopy[friendIndex],
              messageGroups: groupMessage(
                messageGroupsCopy,
                queuedMessage,
                _id,
              ),
            };
          }

          return prevCopy;
        });

        setScrollToBottom((prev: boolean) => !prev);

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

        const queueId = queuedMessage?.queueId || '';

        const createdChat = await createChat({
          variables: {
            userId: _id,
            friendId,
            queueId,
            type: 'private',
            friendUserId: queuedMessage?.friendUserId,
          },
        });

        const createdChatData = createdChat?.data?.createChat;
        const createdChatId = createdChatData?._id;
        const createdChatMembers = createdChatData?.members;

        if (!createdChatId) throw new Error('Failed to create chat');
        // to do
        // pop from setQueuedMessages
        // setQueuedMessages([]);

        chatIdToUse = createdChatId;

        const updatedQueuedMessage = await MessageQueue.updateMessageToQueue(
          queueId,
          {
            chatId: chatIdToUse,
            otherMembers: getOtherMembers(createdChatMembers),
          },
          ['friendId', 'friendUserId'],
        ).catch((err) => {
          console.error('Error updating to queue:', err);
          return null;
        });

        if (updatedQueuedMessage) {
          queuedMessage = updatedQueuedMessage;
          isUpdated = true;
        }

        if (!isUpdated) {
          queuedMessage = deleteKeyValuePairs(
            ['friendId', 'friendUserId'],
            queuedMessage,
          );
          queuedMessage = {
            ...queuedMessage,
            chatId: chatIdToUse,
            otherMembers: getOtherMembers(createdChatMembers),
          };
        }

        setSearchParams((params) => {
          params.set('id', chatIdToUse);
          params.set('type', 'chat');
          return params;
        });
      }

      if (chatIdToUse) {
        queuedMessage = queuedMessage || {
          chatId: chatIdToUse,
          otherMembers: getOtherMembers(chat?.chat?.members),
          ...queuedMessageData,
        };

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
          variables: { chatId },
        });

        setScrollToBottom((prev: boolean) => !prev);

        if (!isAdded) {
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
        }

        const queueId = queuedMessage?.queueId || '';
        const queuedMessageSender = queuedMessage?.sender;
        const queuedMessageQueuedStatus = queuedMessageSender?.queuedStatus;
        const queuedMessageQueuedStatusIsQueued =
          queuedMessageQueuedStatus?.isQueued || true;
        const queuedMessageQueuedStatusTimestamp =
          queuedMessageQueuedStatus?.timestamp || timestamp;

        const createdMessage = await createMessage({
          variables: {
            chatId: chatIdToUse,
            senderId: _id,
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
      setLoadingCreateMessage(false);
    }
  };

  const loading = loadingQuery || chatLoading || friendLoading;

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
                    alignItems: 'flex-start',
                    textProps: {
                      primary: selectedItem?.details?.name,
                      secondary: selectedItem?.details?.email,
                      primaryTypographyProps: {
                        fontSize: '1.0625rem',
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
                      src: selectedItem?.details?.picture,
                    },
                  }}
                />
              </List>
            )}
          </Toolbar>
        </AppBar>
      </div>
      {loading ? null : (
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
