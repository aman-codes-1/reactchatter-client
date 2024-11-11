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
  deleteKeyValuePairs,
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
    createMessage,
    createChat,
    isListItemClicked,
    selectedItem,
    selectedDetails,
    setLoadingCreateMessage,
    setQueuedMessages,
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

  const getOtherMembers = (members: any[] = []) => {
    if (members?.length) {
      const otherMembers = members
        ?.filter((member: any) => member?._id !== _id)
        ?.map((member: any) => {
          const { hasCreated, ...rest } = member || {};
          return {
            ...rest,
            deliveredStatus: null,
            readStatus: null,
          };
        });

      return otherMembers;
    }

    return [];
  };

  const getSender = (members: any[], timestamp: number) => {
    if (members?.length) {
      const sender = members?.find((member: any) => member?._id === _id);
      const { hasCreated, ...rest } = sender || {};
      return {
        ...rest,
        retryStatus: null,
        queuedStatus: {
          isQueued: true,
          timestamp,
        },
        sentStatus: null,
      };
    }

    return {};
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
        timestamp,
      };

      if (!chatIdToUse && friendId) {
        queuedMessage = {
          friendId,
          friendUserId: selectedDetails?._id,
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
            queueId,
            type: 'private',
            friendIds: [friendId],
            friendUserIds: [queuedMessage?.friendUserId],
          },
        });

        const createdChatData = createdChat?.data?.createChat;
        const createdChatId = createdChatData?._id;
        const createdChatMembers = createdChatData?.members;

        if (!createdChatId) throw new Error('Failed to create chat');

        chatIdToUse = createdChatId;

        setSearchParams((params) => {
          params.set('id', chatIdToUse);
          params.set('type', 'chat');
          return params;
        });

        // to do
        // add chatId to state
        // then, pop from setQueuedMessages
        // setQueuedMessages([]);

        const updatedQueuedMessage = await MessageQueue.updateMessageToQueue(
          queueId,
          {
            chatId: chatIdToUse,
            otherMembers: getOtherMembers(createdChatMembers),
            sender: getSender(createdChatMembers, timestamp),
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
            sender: getSender(createdChatMembers, timestamp),
          };
        }
      }

      if (chatIdToUse) {
        queuedMessage = queuedMessage || {
          chatId: chatIdToUse,
          otherMembers: getOtherMembers(selectedItem?.members),
          sender: getSender(selectedItem?.members, timestamp),
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
      setLoadingCreateMessage(false);
    }
  };

  const loading = chatLoading || chatCalled || friendLoading || friendCalled;

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
                      primary: selectedDetails?.name,
                      secondary: selectedDetails?.email,
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
