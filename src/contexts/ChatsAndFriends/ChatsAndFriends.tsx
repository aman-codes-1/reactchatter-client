import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from '@apollo/client';
import { useAuth } from '../../hooks';
import {
  addArray,
  addObject,
  addRequest,
  checkIsMemberExists,
  deleteObject,
  deleteRequest,
  findAndMoveToTop,
  findAndUpdate,
  getFriendId,
  getLastMessage,
  getMember,
  sortByLastMessageTimestamp,
  sortByTimestamp,
  uniqueQueuedMessages,
} from '../../helpers';
import { MessageQueueService } from '../../services';
import { ApolloClientContext } from '..';
import {
  CHATS_QUERY,
  CHAT_ADDED_SUBSCRIPTION,
  CHAT_QUERY,
  CHAT_UPDATED_SUBSCRIPTION,
  CREATE_CHAT_MUTATION,
  CREATE_MESSAGE_MUTATION,
  CREATE_REQUEST_MUTATION,
  FRIEND_ADDED_SUBSCRIPTION,
  FRIEND_QUERY,
  CACHED_MESSAGES_QUERY,
  MESSAGES_QUERY,
  MESSAGE_ADDED_SUBSCRIPTION,
  MESSAGE_UPDATED_SUBSCRIPTION,
  OTHER_FRIENDS_QUERY,
  PENDING_REQUESTS_QUERY,
  REQUEST_ADDED_SUBSCRIPTION,
  REQUEST_UPDATED_SUBSCRIPTION,
  SENT_REQUESTS_QUERY,
  UPDATE_REQUEST_MUTATION,
  USER_ONLINE_STATUS_SUBSCRIPTION,
  USER_ONLINE_STATUS_QUERY,
} from '.';

export const ChatsAndFriendsContext = createContext<any>({});

export const ChatsAndFriendsProvider = ({ children }: any) => {
  const client = useApolloClient();
  const MessageQueue = new MessageQueueService();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId =
    searchParams.get('type') === 'chat' ? searchParams.get('id') : null;
  const fullFriendId =
    searchParams.get('type') === 'friend' ? searchParams.get('id') : null;
  const { friendId } = getFriendId(fullFriendId);
  const [isListItemClicked, setIsListItemClicked] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>();
  const [selectedDetails, setSelectedDetails] = useState<any>();
  const [loadingCreateMessage, setLoadingCreateMessage] = useState(false);
  const [loadingProcessNextMessage, setLoadingProcessNextMessage] =
    useState(false);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [scrollToPosition, setScrollToPosition] = useState(false);
  const [isRefetchingMessages, setIsRefetchingMessages] = useState(false);
  const [isFetchingMessages, setIsFetchingMessages] = useState(true);
  const [isFetchingChats, setIsFetchingChats] = useState(true);
  const [isFetchingOtherFriends, setIsFetchingOtherFriends] = useState(true);
  const [isHomeButtonClicked, setIsHomeButtonClicked] = useState(false);
  const { auth: { _id = '' } = {} } = useAuth();
  const { isWsConnected } = useContext(ApolloClientContext);

  const {
    data: chat,
    loading: chatLoading,
    error: chatError,
    client: chatClient,
    called: chatCalled,
  } = useQuery(CHAT_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      chatId,
    },
    skip: !chatId || !!friendId || !!selectedItem || !!selectedDetails,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const item = data?.chat;
      const isPrivateChat = item?.type === 'private';
      const isGroupChat = item?.type === 'group';
      if (isPrivateChat) {
        const { otherMember } = getMember(item?.members, _id);
        setSelectedItem(item);
        setSelectedDetails(otherMember);
      }
      if (isGroupChat) {
        setSelectedItem(item);
        setSelectedDetails(item?.groupDetails);
      }
    },
    onError: () => {
      navigate('/');
    },
  });

  const {
    data: friend,
    loading: friendLoading,
    error: friendError,
    client: friendClient,
    called: friendCalled,
  } = useQuery(FRIEND_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      friendId,
      userId: _id,
    },
    skip: !friendId || !!chatId || !!selectedItem || !!selectedDetails,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const item = data?.friend;
      const itemHasChats = item?.hasChats;
      if (itemHasChats) {
        navigate('/');
      } else {
        const { otherMember } = getMember(item?.members, _id);
        setSelectedItem(item);
        setSelectedDetails(otherMember);
      }
    },
    onError: () => {
      navigate('/');
    },
  });

  const {
    data: {
      cachedMessages: {
        edges: messages = [],
        pageInfo: messagesPageInfo = {},
        scrollPosition: messagesScrollPosition = 0,
        isFetched: messagesIsFetched = true,
      } = {},
    } = {},
    client: cachedMessagesClient,
  } = useQuery(CACHED_MESSAGES_QUERY, {
    fetchPolicy: 'cache-only',
    variables: { chatId: chatId || fullFriendId },
    skip: !chatId && !fullFriendId,
    notifyOnNetworkStatusChange: true,
  });

  const {
    loading: messagesLoading,
    error: messagesError,
    called: messagesCalled,
    fetchMore: fetchMoreMessages,
    refetch: refetchMessages,
    subscribeToMore: subscribeMessagesToMore,
  } = useQuery(MESSAGES_QUERY, {
    fetchPolicy: 'no-cache',
    variables: { chatId },
    skip: !chatId || !!fullFriendId || !!selectedItem || !!selectedDetails,
    onCompleted: async (data) => {
      const messagesData = data?.messages;
      let edges = messagesData?.edges;
      const pageInfo = messagesData?.pageInfo;
      const scrollPosition = messagesData?.scrollPosition;
      const isFetched = messagesData?.isFetched;
      if (chatId && !isRefetchingMessages) {
        const fetchedQueuedMessages =
          (await getQueuedMessages(chatId, edges, pageInfo)) || [];
        const updatedData = addArray(fetchedQueuedMessages, edges);
        if (updatedData?.length) {
          edges = sortByTimestamp(updatedData);
        }
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
          variables: { chatId },
        });
        setScrollToBottom((prev: boolean) => !prev);
      }
      setIsFetchingMessages(false);
      setIsRefetchingMessages(false);
    },
    onError: (error) => {
      setIsFetchingMessages(false);
      setIsRefetchingMessages(false);
      const err = error?.message;
      if (err?.includes('Chat not found')) {
        navigate('/');
      }
    },
  });

  const {
    data: userOnlineStatus,
    loading: userOnlineStatusLoading,
    error: userOnlineStatusError,
    client: userOnlineStatusClient,
    called: userOnlineStatusCalled,
  } = useQuery(USER_ONLINE_STATUS_QUERY, {
    variables: {
      userId: selectedDetails?._id,
    },
    skip: !selectedItem || !selectedDetails,
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: { chats = [] } = {},
    loading: chatsLoading,
    error: chatsError,
    client: chatsClient,
    called: chatsCalled,
    subscribeToMore: subscribeChatsToMore,
    refetch: refetchChats,
  } = useQuery(CHATS_QUERY, {
    variables: {
      userId: _id,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: async (data) => {
      const chatsData = data?.chats;
      if (chatsData?.length) {
        const res = await MessageQueue.getLastQueuedMessageByData(chatsData);
        if (res?.isUpdated) {
          const updatedChats = res?.data;
          if (updatedChats?.length) {
            const sortedData = sortByLastMessageTimestamp(updatedChats);
            chatsClient.writeQuery({
              query: CHATS_QUERY,
              data: {
                chats: sortedData,
              },
              variables: { userId: _id },
            });
          }
        }
      }
      setIsFetchingChats(false);
    },
    onError: () => {
      setIsFetchingChats(false);
    },
  });

  const {
    data: { otherFriends = [] } = {},
    loading: otherFriendsLoading,
    error: otherFriendsError,
    client: otherFriendsClient,
    called: otherFriendsCalled,
    subscribeToMore: subscribeOtherFriendsToMore,
    refetch: refetchOtherFriends,
  } = useQuery(OTHER_FRIENDS_QUERY, {
    variables: {
      userId: _id,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: async (data) => {
      const otherFriendsData = data?.otherFriends;
      if (otherFriendsData?.length) {
        const res = await MessageQueue.getLastQueuedMessageByData(
          otherFriendsData,
          'friend',
          _id,
        );
        if (res?.isUpdated) {
          const updatedOtherFriends = res?.data;
          if (updatedOtherFriends?.length) {
            const dataWithLastMessage = updatedOtherFriends?.filter(
              (el: any) => el?.lastMessage,
            );
            if (dataWithLastMessage?.length) {
              chatsClient.cache.modify({
                fields: {
                  [`chats({"input":{"userId":"${_id}"}})`](existingData: any) {
                    const updatedData = addArray(
                      dataWithLastMessage,
                      existingData,
                    );
                    if (updatedData?.length) {
                      const sortedData =
                        sortByLastMessageTimestamp(updatedData);
                      return sortedData;
                    }
                    return existingData;
                  },
                },
              });
              const dataWithoutLastMessage = updatedOtherFriends?.filter(
                (el: any) => !el?.lastMessage,
              );
              const sortedData = sortByLastMessageTimestamp(
                dataWithoutLastMessage,
              );
              otherFriendsClient.writeQuery({
                query: OTHER_FRIENDS_QUERY,
                data: {
                  otherFriends: sortedData,
                },
                variables: { userId: _id },
              });
            }
          }
        }
      }
      setIsFetchingOtherFriends(false);
    },
    onError: () => {
      setIsFetchingOtherFriends(false);
    },
  });

  const {
    data: {
      pendingRequests: {
        data: pendingRequests = [],
        totalCount: pendingRequestsCount = 0,
      } = {},
    } = {},
    loading: pendingRequestsLoading,
    error: pendingRequestsError,
    client: pendingRequestsClient,
    called: pendingRequestsCalled,
    refetch: refetchPendingRequests,
  } = useQuery(PENDING_REQUESTS_QUERY, {
    variables: {
      userId: _id,
    },
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: {
      sentRequests: {
        data: sentRequests = [],
        totalCount: sentRequestsCount = 0,
      } = {},
    } = {},
    loading: sentRequestsLoading,
    error: sentRequestsError,
    client: sentRequestsClient,
    called: sentRequestsCalled,
    refetch: refetchSentRequests,
  } = useQuery(SENT_REQUESTS_QUERY, {
    variables: {
      userId: _id,
    },
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: OnMessageAdded,
    loading: OnMessageAddedLoading,
    error: OnMessageAddedError,
  } = useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    onData: async (res) => {
      const OnMessageAddedData = res?.data?.data?.OnMessageAdded;
      const OnMessageAddedMessage = OnMessageAddedData?.message;
      const OnMessageAddedMessageId = OnMessageAddedMessage?._id;
      const OnMessageAddedChatId = OnMessageAddedMessage?.chatId;
      const OnMessageAddedQueueId = OnMessageAddedMessage?.queueId;
      const OnMessageAddedSender = OnMessageAddedMessage?.sender;
      const OnMessageAddedSenderId = OnMessageAddedSender?._id;
      const OnMessageAddedOtherMembers = OnMessageAddedMessage?.otherMembers;

      const isMemberExists =
        OnMessageAddedSenderId && OnMessageAddedSenderId === _id;
      const isOtherMemberExists = OnMessageAddedOtherMembers?.length
        ? OnMessageAddedOtherMembers.some(
            (member: any) => member?._id && member?._id === _id,
          )
        : false;

      if (isMemberExists || isOtherMemberExists) {
        let edges: any[] = [];
        let pageInfo = {
          endCursor: OnMessageAddedMessageId,
          hasPreviousPage: false,
          hasNextPage: false,
        };
        let scrollPosition = 0;
        let isFetched = false;
        let isWrite = false;
        let isWriteChats = false;

        const cachedMessagesQuery = await cachedMessagesClient.readQuery({
          query: CACHED_MESSAGES_QUERY,
          variables: { chatId: OnMessageAddedChatId },
        });

        if (cachedMessagesQuery) {
          const cachedData = cachedMessagesQuery?.cachedMessages;
          edges = cachedData?.edges || [];
          pageInfo = cachedData?.pageInfo?.endCursor
            ? cachedData?.pageInfo
            : pageInfo;
          scrollPosition = cachedData?.scrollPosition;
          isFetched = cachedData?.isFetched;
        }

        if (isMemberExists) {
          const { isFoundAndUpdated, data } = findAndUpdate(
            OnMessageAddedQueueId,
            'queueId',
            edges,
            OnMessageAddedMessage,
          );
          if (isFoundAndUpdated && data?.length) {
            edges = data;
          } else {
            // to do: sortByTimestamp
            edges = addObject(OnMessageAddedMessage, edges);
          }
          isWrite = true;
        }

        if (isOtherMemberExists) {
          // to do: sortByTimestamp
          edges = addObject(OnMessageAddedMessage, edges);
          isWrite = true;
          isWriteChats = true;
        }

        if (isWrite) {
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
            variables: { chatId: OnMessageAddedChatId },
          });
        }

        if (isWriteChats) {
          chatsClient.cache.modify({
            fields: {
              [`chats({"input":{"userId":"${_id}"}})`](existingData: any) {
                const data = findAndMoveToTop(
                  OnMessageAddedChatId,
                  '_id',
                  existingData,
                );
                return data;
              },
            },
          });
        }
      }
    },
  });

  const {
    data: OnMessageUpdated,
    loading: OnMessageUpdatedLoading,
    error: OnMessageUpdatedError,
  } = useSubscription(MESSAGE_UPDATED_SUBSCRIPTION, {
    onData: async (res) => {
      const OnMessageUpdatedData = res?.data?.data?.OnMessageUpdated;
      const OnMessageUpdatedMessage = OnMessageUpdatedData?.message;
      const OnMessageUpdatedMessageId = OnMessageUpdatedMessage?._id;
      const OnMessageUpdatedQueueId = OnMessageUpdatedMessage?.queueId;
      const OnMessageUpdatedChatId = OnMessageUpdatedMessage?.chatId;
      const OnMessageUpdatedSender = OnMessageUpdatedMessage?.sender;
      const OnMessageUpdatedSenderId = OnMessageUpdatedSender?._id;
      const OnMessageUpdatedOtherMembers =
        OnMessageUpdatedMessage?.otherMembers;

      const isMemberExists =
        OnMessageUpdatedSenderId && OnMessageUpdatedSenderId === _id;
      const isOtherMemberExists = OnMessageUpdatedOtherMembers?.length
        ? OnMessageUpdatedOtherMembers.some(
            (member: any) => member?._id && member?._id === _id,
          )
        : false;

      if (isMemberExists || isOtherMemberExists) {
        let edges: any[] = [];
        let pageInfo = {
          endCursor: OnMessageUpdatedMessageId,
          hasPreviousPage: false,
          hasNextPage: false,
        };
        let scrollPosition = 0;
        let isFetched = false;

        const cachedMessagesQuery = await cachedMessagesClient.readQuery({
          query: CACHED_MESSAGES_QUERY,
          variables: { chatId: OnMessageUpdatedChatId },
        });

        if (cachedMessagesQuery) {
          const cachedData = cachedMessagesQuery?.cachedMessages;
          edges = cachedData?.edges || [];
          pageInfo = cachedData?.pageInfo?.endCursor
            ? cachedData?.pageInfo
            : pageInfo;
          scrollPosition = cachedData?.scrollPosition;
          isFetched = cachedData?.isFetched;
        }

        if (isMemberExists || isOtherMemberExists) {
          const { isFoundAndUpdated, data } = findAndUpdate(
            OnMessageUpdatedQueueId,
            'queueId',
            edges,
            OnMessageUpdatedMessage,
          );
          if (isFoundAndUpdated && data?.length) {
            edges = data;
          } else {
            // to do: sortByTimestamp
            edges = addObject(OnMessageUpdatedMessage, edges);
          }

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
            variables: { chatId: OnMessageUpdatedChatId },
          });

          if (isOtherMemberExists) {
            // to do: update chat with unread message count
          }
        }
      }
    },
  });

  const {
    data: OnChatAdded,
    loading: OnChatAddedLoading,
    error: OnChatAddedError,
  } = useSubscription(CHAT_ADDED_SUBSCRIPTION, {
    onData: (res) => {
      const OnChatAddedData = res?.data?.data?.OnChatAdded;
      const OnChatAddedFriendIds = OnChatAddedData?.friendIds;
      const OnChatAddedChat = OnChatAddedData?.chat;
      const OnChatAddedChatId = OnChatAddedChat?._id;
      const OnChatAddedMembers = OnChatAddedChat?.members;
      const isChatAddedPrivate = OnChatAddedChat?.type === 'private';

      const { isCurrentMember, isOtherMember } = checkIsMemberExists(
        OnChatAddedMembers,
        'hasAdded',
        _id,
      );

      if (isCurrentMember || isOtherMember) {
        if (OnChatAddedFriendIds?.length) {
          OnChatAddedFriendIds?.forEach((OnChatAddedFriendId: string) => {
            if (isChatAddedPrivate) {
              if (isOtherMember) {
                otherFriendsClient.cache.modify({
                  fields: {
                    [`otherFriends({"input":{"userId":"${_id}"}})`](
                      existingData: any,
                    ) {
                      const data = deleteObject(
                        OnChatAddedFriendId,
                        existingData,
                      );
                      return data;
                    },
                  },
                });
                chatsClient.cache.modify({
                  fields: {
                    [`chats({"input":{"userId":"${_id}"}})`](
                      existingData: any,
                    ) {
                      const data = addObject(
                        OnChatAddedChat,
                        existingData,
                        true,
                      );
                      return data;
                    },
                  },
                });
              }

              if (
                OnChatAddedFriendId &&
                friendId &&
                OnChatAddedChatId &&
                OnChatAddedFriendId === friendId
              ) {
                if (isOtherMember) {
                  setSearchParams(
                    (params) => {
                      params.set('id', OnChatAddedChatId);
                      params.set('type', 'chat');
                      return params;
                    },
                    { replace: true },
                  );
                }
                const { otherMember } = getMember(OnChatAddedMembers, _id);
                setSelectedItem(OnChatAddedChat);
                setSelectedDetails(otherMember);
              }
            }
          });
        }
      }
    },
  });

  const {
    data: OnChatUpdated,
    loading: OnChatUpdatedLoading,
    error: OnChatUpdatedError,
  } = useSubscription(CHAT_UPDATED_SUBSCRIPTION, {
    onData: (res) => {
      const OnChatUpdatedData = res?.data?.data?.OnChatUpdated;
      const OnChatUpdatedChat = OnChatUpdatedData?.chat;
      const OnChatUpdatedChatId = OnChatUpdatedChat?._id;
      const OnChatUpdatedMembers = OnChatUpdatedChat?.members;

      const { isCurrentMember, isOtherMember } = checkIsMemberExists(
        OnChatUpdatedMembers,
        'hasAdded',
        _id,
      );

      if (isCurrentMember || isOtherMember) {
        chatsClient.cache.modify({
          fields: {
            [`chats({"input":{"userId":"${_id}"}})`](existingData: any) {
              const { isFoundAndUpdated, data } = findAndUpdate(
                OnChatUpdatedChatId,
                '_id',
                existingData,
                OnChatUpdatedChat,
              );
              if (isFoundAndUpdated && data?.length) {
                return data;
              }
              return existingData;
            },
          },
        });
      }
    },
  });

  const {
    data: OnFriendAdded,
    loading: OnFriendAddedLoading,
    error: OnFriendAddedError,
  } = useSubscription(FRIEND_ADDED_SUBSCRIPTION, {
    onData: (res: any) => {
      const OnFriendAddedData = res?.data?.data?.OnFriendAdded;
      const OnFriendAddedFriend = OnFriendAddedData?.friend;
      const OnFriendAddedMembers = OnFriendAddedFriend?.members;

      const { isCurrentMember, isOtherMember } = checkIsMemberExists(
        OnFriendAddedMembers,
        'hasAdded',
        _id,
      );

      if (isCurrentMember || isOtherMember) {
        otherFriendsClient.cache.modify({
          fields: {
            [`otherFriends({"input":{"userId":"${_id}"}})`](existingData: any) {
              const data = addObject(OnFriendAddedFriend, existingData, true);
              return data;
            },
          },
        });
      }
    },
  });

  const {
    data: OnRequestAdded,
    loading: OnRequestAddedLoading,
    error: OnRequestAddedError,
  } = useSubscription(REQUEST_ADDED_SUBSCRIPTION, {
    onData: (res) => {
      const OnRequestAddedData = res?.data?.data?.OnRequestAdded;
      const OnRequestAddedRequest = OnRequestAddedData?.request;
      const OnRequestAddedMembers = OnRequestAddedRequest?.members;

      const { isCurrentMember, isOtherMember } = checkIsMemberExists(
        OnRequestAddedMembers,
        'hasSent',
        _id,
      );

      if (isCurrentMember) {
        sentRequestsClient.cache.modify({
          fields: {
            [`sentRequests({"input":{"userId":"${_id}"}})`](existingData: any) {
              const data = addRequest(OnRequestAddedRequest, existingData);
              return data;
            },
          },
        });
      }

      if (isOtherMember) {
        pendingRequestsClient.cache.modify({
          fields: {
            [`pendingRequests({"input":{"userId":"${_id}"}})`](
              existingData: any,
            ) {
              const data = addRequest(OnRequestAddedRequest, existingData);
              return data;
            },
          },
        });
      }
    },
  });

  const {
    data: OnRequestUpdated,
    loading: OnRequestUpdatedLoading,
    error: OnRequestUpdatedError,
  } = useSubscription(REQUEST_UPDATED_SUBSCRIPTION, {
    onData: (res) => {
      const OnRequestUpdatedData = res?.data?.data?.OnRequestUpdated;
      const OnRequestUpdatedRequest = OnRequestUpdatedData?.request;
      const OnRequestUpdatedMembers = OnRequestUpdatedRequest?.members;

      const { isCurrentMember, isOtherMember } = checkIsMemberExists(
        OnRequestUpdatedMembers,
        'hasSent',
        _id,
      );

      if (isCurrentMember) {
        sentRequestsClient.cache.modify({
          fields: {
            [`sentRequests({"input":{"userId":"${_id}"}})`](existingData: any) {
              const data = deleteRequest(OnRequestUpdatedRequest, existingData);
              return data;
            },
          },
        });
      }

      if (isOtherMember) {
        pendingRequestsClient.cache.modify({
          fields: {
            [`pendingRequests({"input":{"userId":"${_id}"}})`](
              existingData: any,
            ) {
              const data = deleteRequest(OnRequestUpdatedRequest, existingData);
              return data;
            },
          },
        });
      }
    },
  });

  const {
    data: OnUserOnlineStatus,
    loading: OnUserOnlineStatusLoading,
    error: OnUserOnlineStatusError,
  } = useSubscription(USER_ONLINE_STATUS_SUBSCRIPTION, {
    onData: (res) => {
      const OnUserOnlineStatusData = res?.data?.data?.OnUserOnlineStatus;
      const OnUserOnlineStatusUserId = OnUserOnlineStatusData?.userId;
      if (OnUserOnlineStatusUserId && OnUserOnlineStatusUserId !== _id) {
        userOnlineStatusClient.writeQuery({
          query: USER_ONLINE_STATUS_QUERY,
          data: {
            userOnlineStatus: OnUserOnlineStatusData,
          },
          variables: { userId: OnUserOnlineStatusUserId },
        });
      }
    },
  });

  const [
    createMessage,
    {
      data: createMessageData,
      loading: createMessageLoading,
      error: createMessageError,
    },
  ] = useMutation(CREATE_MESSAGE_MUTATION);

  const [
    createChat,
    {
      data: createChatData,
      loading: createChatLoading,
      error: createChatError,
    },
  ] = useMutation(CREATE_CHAT_MUTATION);

  const [
    createRequest,
    {
      data: createRequestData,
      loading: createRequestLoading,
      error: createRequestError,
    },
  ] = useMutation(CREATE_REQUEST_MUTATION);

  const [
    updateRequest,
    {
      data: updateRequestData,
      loading: updateRequestLoading,
      error: updateRequestError,
    },
  ] = useMutation(UPDATE_REQUEST_MUTATION);

  useLayoutEffect(() => {
    if (!pathname?.includes('/chat')) {
      setSelectedItem(undefined);
      setSelectedDetails(undefined);
    }
  }, [pathname]);

  useEffect(() => {
    const messageQueueService = new MessageQueueService(
      friendId,
      createChat,
      createMessage,
      chatsClient,
      cachedMessagesClient,
      setSearchParams,
      setLoadingProcessNextMessage,
    );

    const startQueueProcessing = async () => {
      if (!isWsConnected || loadingCreateMessage || loadingProcessNextMessage)
        return;
      await messageQueueService.processQueue();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        startQueueProcessing();
      }
    };

    startQueueProcessing();

    const eventListeners: {
      target: Window | Document;
      event: string;
      handler: (e?: Event) => void;
    }[] = [
      { target: window, event: 'mousemove', handler: startQueueProcessing },
      { target: window, event: 'keydown', handler: startQueueProcessing },
      { target: window, event: 'click', handler: startQueueProcessing },
      { target: window, event: 'scroll', handler: startQueueProcessing },
      { target: window, event: 'focus', handler: startQueueProcessing },
      { target: window, event: 'online', handler: startQueueProcessing },
      {
        target: document,
        event: 'visibilitychange',
        handler: handleVisibilityChange,
      },
    ];

    eventListeners.forEach(({ target, event, handler }) =>
      target.addEventListener(event, handler),
    );

    return () => {
      eventListeners.forEach(({ target, event, handler }) =>
        target.removeEventListener(event, handler),
      );
    };
  }, [
    friendId,
    isWsConnected,
    loadingCreateMessage,
    loadingProcessNextMessage,
  ]);

  const fetchMessages = async (id: string) => {
    try {
      const res = await refetchMessages({ chatId: id });
      return res;
    } catch (err: any) {
      const error = err?.message;
      if (error) {
        if (error?.includes('Chat not found')) {
          navigate('/');
        }
        throw new Error(error);
      }
    }
  };

  const getQueuedMessages = async (
    id: string,
    edges?: any[],
    pageInfo?: any,
  ) => {
    let startTimestamp = null;
    let endTimestamp = null;
    if (edges?.length) {
      const oldestMessage = edges?.[0];
      startTimestamp = pageInfo?.hasNextPage ? oldestMessage?.timestamp : null;
      const newestMessage = edges?.[edges?.length - 1];
      endTimestamp = pageInfo?.hasPreviousPage
        ? newestMessage?.timestamp
        : null;
    }
    const res = await MessageQueue.getQueuedMessagesById(
      id,
      startTimestamp,
      endTimestamp,
    );
    setIsFetchingMessages(false);
    return res;
  };

  const getChatMessagesWithQueue = async (id: string, key: string) => {
    try {
      let edges: any[] = [];
      let pageInfo = {
        endCursor: '',
        hasPreviousPage: false,
        hasNextPage: false,
      };
      let scrollPosition = 0;
      let isFetched = false;
      let isWrite = false;

      const cachedMessagesQuery = await cachedMessagesClient.readQuery({
        query: CACHED_MESSAGES_QUERY,
        variables: { chatId: id },
      });

      if (cachedMessagesQuery) {
        const cachedData = cachedMessagesQuery?.cachedMessages;
        edges = cachedData?.edges || [];
        pageInfo = cachedData?.pageInfo;
        scrollPosition = cachedData?.scrollPosition;
        isFetched = cachedData?.isFetched;
      }

      if (!cachedMessagesQuery || !isFetched) {
        if (key === 'chat') {
          setIsRefetchingMessages(true);
          const fetchedData = await fetchMessages(id);
          const fetchedMessages = fetchedData?.data?.messages;
          const fetchedMessagesEdges = fetchedMessages?.edges;
          const fetchedMessagesPageInfo = fetchedMessages?.pageInfo;
          const fetchedMessagesScrollPosition = fetchedMessages?.scrollPosition;
          const fetchedMessagesIsFetched = fetchedMessages?.isFetched;
          edges = fetchedMessagesEdges || [];
          pageInfo = fetchedMessagesPageInfo;
          scrollPosition = fetchedMessagesScrollPosition;
          isFetched = fetchedMessagesIsFetched;
          isWrite = true;
        }
      }

      const fetchedQueuedMessages = await getQueuedMessages(
        id,
        edges,
        pageInfo,
      );

      if (fetchedQueuedMessages?.length) {
        const uniqueMessages = uniqueQueuedMessages(
          edges,
          fetchedQueuedMessages,
        );

        if (uniqueMessages?.length) {
          const updatedData = addArray(uniqueMessages, edges);
          if (updatedData?.length) {
            edges = sortByTimestamp(updatedData);
          }
          scrollPosition = 0;
          isWrite = true;
        }
      }

      if (isWrite) {
        chatsClient.cache.modify({
          fields: {
            [`chats({"input":{"userId":"${_id}"}})`](existingData: any) {
              const lastMessage = getLastMessage(edges);
              const { isFoundAndUpdated, data } = findAndUpdate(
                id,
                '_id',
                existingData,
                lastMessage,
                'lastMessage',
              );
              if (isFoundAndUpdated && data?.length) {
                const sortedData = sortByLastMessageTimestamp(data);
                return sortedData;
              }
              return existingData;
            },
          },
        });

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
      }

      if (scrollPosition === 0) {
        setScrollToBottom((prev) => !prev);
      } else {
        setScrollToPosition((prev) => !prev);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const fetchAll = async () => {
    if (isFetchingChats || isFetchingOtherFriends) return;
    setIsFetchingChats(true);
    setIsFetchingOtherFriends(true);
    await client.clearStore();
    await refetchChats();
    await refetchOtherFriends();
    await Promise.allSettled([refetchPendingRequests(), refetchSentRequests()]);
  };

  return (
    <ChatsAndFriendsContext.Provider
      value={{
        // query
        // chat
        chat,
        chatLoading,
        chatError,
        chatClient,
        chatCalled,
        // friend
        friend,
        friendLoading,
        friendError,
        friendClient,
        friendCalled,
        // cachedMessages
        cachedMessagesClient,
        // messages
        messages,
        messagesPageInfo,
        messagesScrollPosition,
        messagesIsFetched,
        messagesLoading,
        messagesError,
        messagesCalled,
        subscribeMessagesToMore,
        fetchMoreMessages,
        refetchMessages,
        // userOnlineStatus
        userOnlineStatus,
        userOnlineStatusLoading,
        userOnlineStatusError,
        userOnlineStatusClient,
        userOnlineStatusCalled,
        // chats
        chats,
        chatsLoading,
        chatsError,
        chatsClient,
        chatsCalled,
        subscribeChatsToMore,
        refetchChats,
        // otherFriends
        otherFriends,
        otherFriendsLoading,
        otherFriendsError,
        otherFriendsClient,
        otherFriendsCalled,
        subscribeOtherFriendsToMore,
        refetchOtherFriends,
        // pendingRequests
        pendingRequests,
        pendingRequestsCount,
        pendingRequestsLoading,
        pendingRequestsError,
        pendingRequestsClient,
        pendingRequestsCalled,
        refetchPendingRequests,
        // sentRequests
        sentRequests,
        sentRequestsCount,
        sentRequestsLoading,
        sentRequestsError,
        sentRequestsClient,
        sentRequestsCalled,
        refetchSentRequests,

        // subscription
        // OnMessageAdded
        OnMessageAdded,
        OnMessageAddedLoading,
        OnMessageAddedError,
        // OnMessageUpdated
        OnMessageUpdated,
        OnMessageUpdatedLoading,
        OnMessageUpdatedError,
        // OnChatAdded
        OnChatAdded,
        OnChatAddedLoading,
        OnChatAddedError,
        // OnChatUpdated
        OnChatUpdated,
        OnChatUpdatedLoading,
        OnChatUpdatedError,
        // OnFriendAdded
        OnFriendAdded,
        OnFriendAddedLoading,
        OnFriendAddedError,
        // OnRequestAdded
        OnRequestAdded,
        OnRequestAddedLoading,
        OnRequestAddedError,
        // OnRequestUpdated
        OnRequestUpdated,
        OnRequestUpdatedLoading,
        OnRequestUpdatedError,
        // OnUserOnlineStatus
        OnUserOnlineStatus,
        OnUserOnlineStatusLoading,
        OnUserOnlineStatusError,

        // mutation
        // createMessage
        createMessage,
        createMessageData,
        createMessageLoading,
        createMessageError,
        // createChat
        createChat,
        createChatData,
        createChatLoading,
        createChatError,
        // createRequest
        createRequest,
        createRequestData,
        createRequestLoading,
        createRequestError,
        // updateRequest
        updateRequest,
        updateRequestData,
        updateRequestLoading,
        updateRequestError,

        // state
        // isListItemClicked
        isListItemClicked,
        setIsListItemClicked,
        // selectedItem
        selectedItem,
        setSelectedItem,
        // selectedDetails
        selectedDetails,
        setSelectedDetails,
        // loadingCreateMessage
        loadingCreateMessage,
        setLoadingCreateMessage,
        // loadingProcessNextMessage
        loadingProcessNextMessage,
        setLoadingProcessNextMessage,
        // scrollToBottom
        scrollToBottom,
        setScrollToBottom,
        // scrollToPosition
        scrollToPosition,
        setScrollToPosition,
        // isRefetchingMessages
        isRefetchingMessages,
        setIsRefetchingMessages,
        // isFetchingMessage
        isFetchingMessages,
        setIsFetchingMessages,
        // isFetchingChats
        isFetchingChats,
        setIsFetchingChats,
        // isFetchingOtherFriends
        isFetchingOtherFriends,
        setIsFetchingOtherFriends,
        // isHomeButtonClicked
        isHomeButtonClicked,
        setIsHomeButtonClicked,

        // function
        fetchMessages,
        getQueuedMessages,
        getChatMessagesWithQueue,
        fetchAll,
      }}
    >
      {children}
    </ChatsAndFriendsContext.Provider>
  );
};
