import { createContext, useLayoutEffect, useState } from 'react';
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
  findAndUpdate,
  getFriendId,
  getLastMessage,
  renderMember,
  sortByLastMessageTimestamp,
  sortByTimestamp,
  uniqueQueuedMessages,
} from '../../helpers';
import { MessageQueueService } from '../../services';
import {
  ACTIVE_CLIENTS_QUERY,
  CHATS_QUERY,
  CHAT_ADDED_SUBSCRIPTION,
  CHAT_QUERY,
  CHAT_UPDATED_SUBSCRIPTION,
  CLIENTS_UPDATED_SUBSCRIPTION,
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
  // const [loadingProcessNextMessage, setLoadingProcessNextMessage] = useState(false);
  const [loadingQueued, setLoadingQueued] = useState(true);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [scrollToPosition, setScrollToPosition] = useState(false);
  const [isRefetchingMessages, setIsRefetchingMessages] = useState(false);
  const [isFetchingChats, setIsFetchingChats] = useState(true);
  const [isFetchingOtherFriends, setIsFetchingOtherFriends] = useState(true);
  const [isFetchingChats2, setIsFetchingChats2] = useState(true);
  const [isFetchingOtherFriends2, setIsFetchingOtherFriends2] = useState(true);
  const [isHomeButtonClicked, setIsHomeButtonClicked] = useState(false);
  const { auth: { _id = '' } = {} } = useAuth();

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
        const { otherMember } = renderMember(item?.members, _id);
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
        const { otherMember } = renderMember(item?.members, _id);
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
      const messages = data?.messages;
      let edges = messages?.edges;
      const pageInfo = messages?.pageInfo;
      const scrollPosition = messages?.scrollPosition;
      if (chatId && !isRefetchingMessages) {
        const fetchedQueuedMessages =
          (await getQueuedMessages(chatId, edges, pageInfo)) || [];
        edges = sortByTimestamp([...edges, ...fetchedQueuedMessages]);
        cachedMessagesClient.writeQuery({
          query: CACHED_MESSAGES_QUERY,
          data: {
            cachedMessages: {
              edges,
              pageInfo,
              scrollPosition,
            },
          },
          variables: { chatId },
        });
        setScrollToBottom((prev: boolean) => !prev);
      }
      setIsRefetchingMessages(false);
    },
    onError: (error) => {
      setIsRefetchingMessages(false);
      const err = error?.message;
      if (err?.includes('Chat not found')) {
        navigate('/');
      }
    },
  });

  const {
    data: activeClients,
    loading: activeClientsLoading,
    error: activeClientsError,
    client: activeClientsClient,
    called: activeClientsCalled,
  } = useQuery(ACTIVE_CLIENTS_QUERY, {
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
        const res = await MessageQueue.getLastQueuedMessagesByIds(chatsData);
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
      setIsFetchingChats2(false);
    },
    onError: () => {
      setIsFetchingChats(false);
      setIsFetchingChats2(false);
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
        const res =
          await MessageQueue.getLastQueuedMessagesByIds(otherFriendsData);
        if (res?.isUpdated) {
          const updatedOtherFriends = res?.data;
          if (updatedOtherFriends?.length) {
            const dataWithLastMessage = updatedOtherFriends?.filter(
              (friend: any) => friend?.lastMessage,
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
                (friend: any) => !friend?.lastMessage,
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
      setIsFetchingOtherFriends2(false);
    },
    onError: () => {
      setIsFetchingOtherFriends(false);
      setIsFetchingOtherFriends2(false);
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
      // to do: fix caching of messages not working properly when new message received
      const OnMessageAdded = res?.data?.data?.OnMessageAdded;
      const OnMessageAddedMessage = OnMessageAdded?.message;
      const OnMessageAddedChatId = OnMessageAddedMessage?.chatId;
      const OnMessageAddedQueueId = OnMessageAddedMessage?.queueId;
      const OnMessageAddedSender = OnMessageAddedMessage?.sender;
      const OnMessageAddedOtherMembers = OnMessageAddedMessage?.otherMembers;

      const isMemberExists = OnMessageAddedSender?._id === _id;
      const isOtherMemberExists = OnMessageAddedOtherMembers?.length
        ? OnMessageAddedOtherMembers.some((member: any) => member?._id === _id)
        : false;

      if (isMemberExists || isOtherMemberExists) {
        let edges: any[] = [];
        let pageInfo = {
          endCursor: OnMessageAddedMessage?._id,
          hasPreviousPage: false,
          hasNextPage: false,
        };
        pageInfo = messagesPageInfo?.endCursor ? messagesPageInfo : pageInfo;

        if (OnMessageAddedQueueId) {
          const { data } = findAndUpdate(
            OnMessageAddedQueueId,
            'queueId',
            messages,
            OnMessageAddedMessage,
          );
          edges = data;
        } else {
          edges = [...messages, OnMessageAddedMessage];
        }

        cachedMessagesClient.writeQuery({
          query: CACHED_MESSAGES_QUERY,
          data: {
            cachedMessages: {
              edges,
              pageInfo,
              scrollPosition: messagesScrollPosition,
            },
          },
          variables: { chatId: OnMessageAddedChatId },
        });

        setScrollToBottom((prev) => !prev);
      }
    },
  });

  const {
    data: OnMessageUpdated,
    loading: OnMessageUpdatedLoading,
    error: OnMessageUpdatedError,
  } = useSubscription(MESSAGE_UPDATED_SUBSCRIPTION, {
    onData: (res) => {
      // to do: fix caching of messages not working properly when new message received
      const OnMessageUpdated = res?.data?.data?.OnMessageUpdated;
      const OnMessageUpdatedMessage = OnMessageUpdated?.message;
      const OnMessageUpdatedMessageId = OnMessageUpdatedMessage?._id;
      const OnMessageUpdatedChatId = OnMessageUpdatedMessage?.chatId;
      const OnMessageUpdatedSender = OnMessageUpdatedMessage?.sender;
      const OnMessageUpdatedOtherMembers =
        OnMessageUpdatedMessage?.otherMembers;

      const isMemberExists = OnMessageUpdatedSender?._id === _id;
      const isOtherMemberExists = OnMessageUpdatedOtherMembers?.length
        ? OnMessageUpdatedOtherMembers.some(
            (member: any) => member?._id === _id,
          )
        : false;

      if (isMemberExists) {
        let edges: any = [];

        if (OnMessageUpdatedMessageId) {
          const { data } = findAndUpdate(
            OnMessageUpdatedMessageId,
            '_id',
            messages,
            OnMessageUpdatedMessage,
          );
          edges = data;
        } else {
          edges = [...messages, OnMessageUpdatedMessage];
        }

        cachedMessagesClient.cache.modify({
          fields: {
            [`cachedMessages({"input":{"chatId":"${OnMessageUpdatedChatId}"}})`](
              existingData: any,
            ) {
              return {
                ...existingData,
                edges,
              };
            },
          },
        });
      }

      if (isOtherMemberExists) {
        // to do: update chat with unread message count
      }
    },
  });

  const {
    data: OnChatAdded,
    loading: OnChatAddedLoading,
    error: OnChatAddedError,
  } = useSubscription(CHAT_ADDED_SUBSCRIPTION, {
    onData: (res) => {
      const OnChatAdded = res?.data?.data?.OnChatAdded;
      const OnChatAddedFriendIds = OnChatAdded?.friendIds;
      const OnChatAddedChat = OnChatAdded?.chat;
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
                const data = {
                  ...chats,
                  chats: chats?.length
                    ? [OnChatAddedChat, ...chats]
                    : [OnChatAddedChat],
                };
                chatsClient.writeQuery({
                  query: CHATS_QUERY,
                  data,
                  variables: {
                    userId: _id,
                  },
                });
              }

              if (OnChatAddedFriendId === friendId) {
                const { otherMember } = renderMember(OnChatAddedMembers, _id);
                if (isOtherMember) {
                  setSearchParams((params) => {
                    params.set('id', OnChatAddedChat?._id);
                    params.set('type', 'chat');
                    return params;
                  });
                }
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
      const OnChatUpdated = res?.data?.data?.OnChatUpdated;
      const OnChatUpdatedChat = OnChatUpdated?.chat;
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
      const OnFriendAdded = res?.data?.data?.OnFriendAdded;
      const OnFriendAddedFriend = OnFriendAdded?.friend;
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
              const data = addObject(OnFriendAddedFriend, existingData);
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
      const OnRequestAdded = res?.data?.data?.OnRequestAdded;
      const OnRequestAddedRequest = OnRequestAdded?.request;
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
      const OnRequestUpdated = res?.data?.data?.OnRequestUpdated;
      const OnRequestUpdatedRequest = OnRequestUpdated?.request;
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
    data: OnClientsUpdated,
    loading: OnClientsUpdatedLoading,
    error: OnClientsUpdatedError,
  } = useSubscription(CLIENTS_UPDATED_SUBSCRIPTION, {
    onData: (res) => {
      const OnClientsUpdated = res?.data?.data?.OnClientsUpdated;
      const OnClientsUpdatedUserId = OnClientsUpdated?.userId;
      if (OnClientsUpdatedUserId !== _id) {
        activeClientsClient.writeQuery({
          query: ACTIVE_CLIENTS_QUERY,
          data: {
            activeClients: OnClientsUpdated,
          },
          variables: { userId: OnClientsUpdatedUserId },
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

  // useEffect(() => {
  //   // to do
  //   const messageQueueService = new MessageQueueService(
  //     createChat,
  //     createMessage,
  //     setLoadingProcessNextMessage,
  //   );

  //   const startQueueProcessing = async () => {
  //     if (
  //       loadingCreateMessage ||
  //       loadingProcessNextMessage ||
  //       OnMessageAddedLoading
  //     )
  //       return;
  //     await messageQueueService.processQueue();
  //   };

  //   startQueueProcessing();

  //   const handleNetworkChange = () => {
  //     if (navigator.onLine) {
  //       startQueueProcessing();
  //     }
  //   };

  //   const events = [
  //     { name: 'online', handler: handleNetworkChange },
  //     { name: 'visibilitychange', handler: startQueueProcessing },
  //     { name: 'blur', handler: startQueueProcessing },
  //     { name: 'focus', handler: startQueueProcessing },
  //     { name: 'click', handler: startQueueProcessing },
  //     { name: 'scroll', handler: startQueueProcessing },
  //   ];

  //   events.forEach(({ name, handler }) => {
  //     const target = name === 'visibilitychange' ? document : window;
  //     target.addEventListener(name, handler);
  //   });

  //   return () => {
  //     events.forEach(({ name, handler }) => {
  //       const target = name === 'visibilitychange' ? document : window;
  //       target.removeEventListener(name, handler);
  //     });
  //   };
  // }, [loadingCreateMessage, loadingProcessNextMessage, OnMessageAddedLoading]);

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
    setLoadingQueued(false);
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
      let isWrite = false;

      const cachedMessages = await cachedMessagesClient.readQuery({
        query: CACHED_MESSAGES_QUERY,
        variables: { chatId: id },
      });

      if (cachedMessages) {
        const cachedData = cachedMessages?.cachedMessages;
        edges = cachedData?.edges || [];
        pageInfo = cachedData?.pageInfo;
        scrollPosition = cachedData?.scrollPosition;
      } else {
        if (key === 'chat') {
          setIsRefetchingMessages(true);
          const fetchedData = await fetchMessages(id);
          const fetchedMessages = fetchedData?.data?.messages;
          const fetchedMessagesEdges = fetchedMessages?.edges;
          const fetchedMessagesPageInfo = fetchedMessages?.pageInfo;
          edges = fetchedMessagesEdges || [];
          pageInfo = fetchedMessagesPageInfo;
          scrollPosition = 0;
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
          edges = sortByTimestamp([...edges, ...uniqueMessages]);
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
    if (isFetchingChats2 || isFetchingOtherFriends2) return;
    setIsFetchingChats2(true);
    setIsFetchingOtherFriends2(true);
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
        messagesLoading,
        messagesError,
        messagesCalled,
        subscribeMessagesToMore,
        fetchMoreMessages,
        refetchMessages,
        // activeClients
        activeClients,
        activeClientsLoading,
        activeClientsError,
        activeClientsClient,
        activeClientsCalled,
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
        // OnClientsUpdated
        OnClientsUpdated,
        OnClientsUpdatedLoading,
        OnClientsUpdatedError,

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
        // loadingProcessNextMessage,
        // setLoadingProcessNextMessage,
        // loadingQueued
        loadingQueued,
        setLoadingQueued,
        // scrollToBottom
        scrollToBottom,
        setScrollToBottom,
        // scrollToPosition
        scrollToPosition,
        setScrollToPosition,
        // isRefetchingMessages
        isRefetchingMessages,
        setIsRefetchingMessages,
        // isFetchingChats
        isFetchingChats,
        setIsFetchingChats,
        // isFetchingOtherFriends
        isFetchingOtherFriends,
        setIsFetchingOtherFriends,
        // isFetchingChats2
        isFetchingChats2,
        setIsFetchingChats2,
        // isFetchingOtherFriends2
        isFetchingOtherFriends2,
        setIsFetchingOtherFriends2,
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
