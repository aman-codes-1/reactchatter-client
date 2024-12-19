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
  getDateLabel,
  getLastMessage,
  groupMessage,
  groupMessages,
  mergeAllByDateLabel,
  renderMember,
  sortByTimestamp,
  unGroupMessages,
  uniqueQueuedMessages,
  updateGroupedQueuedMessage,
} from '../../helpers';
import { MessageQueueService } from '../../services';
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
  MESSAGES_QUERY,
  MESSAGE_ADDED_SUBSCRIPTION,
  MESSAGE_GROUPS_QUERY,
  MESSAGE_UPDATED_SUBSCRIPTION,
  OTHER_FRIENDS_QUERY,
  PENDING_REQUESTS_QUERY,
  REQUEST_ADDED_SUBSCRIPTION,
  REQUEST_UPDATED_SUBSCRIPTION,
  SENT_REQUESTS_QUERY,
  SESSION_ACTIVE_CLIENTS_SUBSCRIPTION,
  UPDATE_REQUEST_MUTATION,
  USER_ACTIVE_CLIENTS_SUBSCRIPTION,
  USER_ACTIVE_CLIENTS_QUERY,
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
  const friendId =
    searchParams.get('type') === 'friend' ? searchParams.get('id') : null;
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
  const { auth: { _id = '', sessionID = '' } = {}, setAuth } = useAuth();

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
      messageGroups: {
        edges: messageGroups = [],
        pageInfo: messageGroupsPageInfo = {},
        queuedPageInfo: messageGroupsQueuedPageInfo = {},
        scrollPosition: messageGroupsScrollPosition = -1,
      } = {},
    } = {},
    loading: messageGroupsLoading,
    error: messageGroupsError,
    client: messageGroupsClient,
    called: messageGroupsCalled,
    subscribeToMore: subscribeMessageGroupsToMore,
  } = useQuery(MESSAGE_GROUPS_QUERY, {
    fetchPolicy: 'cache-only',
    variables: { chatId: chatId || friendId },
    skip: !chatId && !friendId,
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: {
      messages: { edges: messages = [], pageInfo: messagesPageInfo = {} } = {},
    } = {},
    loading: messagesLoading,
    error: messagesError,
    client: messagesClient,
    called: messagesCalled,
    subscribeToMore: subscribeMessagesToMore,
    fetchMore: fetchMoreMessages,
    refetch: refetchMessages,
  } = useQuery(MESSAGES_QUERY, {
    fetchPolicy: 'no-cache',
    variables: { chatId },
    skip: !chatId || !!friendId || !!selectedItem || !!selectedDetails,
    onCompleted: async (data) => {
      const messages = data?.messages;
      let edges = messages?.edges;
      const pageInfo = messages?.pageInfo;
      const queuedPageInfo = messages?.pageInfo;
      const scrollPosition = -1;
      if (chatId && !isRefetchingMessages) {
        const fetchedQueuedMessages =
          (await getQueuedMessages(chatId, 'chatId')) || [];
        edges = groupAllMessages(edges, fetchedQueuedMessages);
        messageGroupsClient.writeQuery({
          query: MESSAGE_GROUPS_QUERY,
          data: {
            messageGroups: {
              edges,
              pageInfo,
              queuedPageInfo,
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
    data: userActiveClients,
    loading: userActiveClientsLoading,
    error: userActiveClientsError,
    client: userActiveClientsClient,
    called: userActiveClientsCalled,
  } = useQuery(USER_ACTIVE_CLIENTS_QUERY, {
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
        const res = await MessageQueue.getLastQueuedMessagesByIds(
          chatsData,
          'chatId',
        );
        if (res?.isUpdated) {
          const updatedChats = res?.data;
          if (updatedChats?.length) {
            const sortedData = sortByTimestamp(updatedChats);
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
        const res = await MessageQueue.getLastQueuedMessagesByIds(
          otherFriendsData,
          'friendId',
        );
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
                      const sortedData = sortByTimestamp(updatedData);
                      return sortedData;
                    }
                    return existingData;
                  },
                },
              });
              const dataWithoutLastMessage = updatedOtherFriends?.filter(
                (friend: any) => !friend?.lastMessage,
              );
              const sortedData = sortByTimestamp(dataWithoutLastMessage);
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
      const OnMessageAddedMessageChatId = OnMessageAddedMessage?.chatId;
      const OnMessageAddedQueueId = OnMessageAddedMessage?.queueId;
      const OnMessageAddedSender = OnMessageAddedMessage?.sender;
      const OnMessageAddedOtherMembers = OnMessageAddedMessage?.otherMembers;

      const isMemberExists = OnMessageAddedSender?._id === _id;
      const isOtherMemberExists = OnMessageAddedOtherMembers?.length
        ? OnMessageAddedOtherMembers.some((member: any) => member?._id === _id)
        : false;

      if (isMemberExists || isOtherMemberExists) {
        let edges = [];
        let pageInfo = {
          endCursor: OnMessageAddedMessage?._id,
          hasNextPage: false,
        };
        let queuedPageInfo = {
          endCursor: OnMessageAddedMessage?._id,
          hasNextPage: false,
        };
        pageInfo = messageGroupsPageInfo?.endCursor
          ? messageGroupsPageInfo
          : pageInfo;
        queuedPageInfo = messageGroupsQueuedPageInfo?.endCursor
          ? messageGroupsQueuedPageInfo
          : queuedPageInfo;

        if (OnMessageAddedQueueId) {
          edges = updateGroupedQueuedMessage(
            messageGroups,
            OnMessageAddedQueueId,
            OnMessageAddedMessage,
            _id,
          );
        } else {
          edges = groupMessage(messageGroups, OnMessageAddedMessage, _id);
        }

        messageGroupsClient.writeQuery({
          query: MESSAGE_GROUPS_QUERY,
          data: {
            messageGroups: {
              edges,
              pageInfo,
              queuedPageInfo,
              scrollPosition: -1,
            },
          },
          variables: { chatId: OnMessageAddedMessageChatId },
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
      // to do
      // deliver message, read message
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
    data: OnSessionActiveClients,
    loading: OnSessionActiveClientsLoading,
    error: OnSessionActiveClientsError,
  } = useSubscription(SESSION_ACTIVE_CLIENTS_SUBSCRIPTION, {
    variables: {
      sessionID,
    },
    onData: (res) => {
      const OnSessionActiveClients = res?.data?.data?.OnSessionActiveClients;
      const OnSessionActiveClientsSessionID = OnSessionActiveClients?.sessionID;
      const OnSessionActiveClientsAllClients = OnSessionActiveClients?.clients;
      if (OnSessionActiveClientsSessionID === sessionID) {
        setAuth((prev: any) => ({
          ...prev,
          clients: OnSessionActiveClientsAllClients,
        }));
      }
    },
  });

  const {
    data: OnUserActiveClients,
    loading: OnUserActiveClientsLoading,
    error: OnUserActiveClientsError,
  } = useSubscription(USER_ACTIVE_CLIENTS_SUBSCRIPTION, {
    onData: (res) => {
      const OnUserActiveClients = res?.data?.data?.OnUserActiveClients;
      const OnUserActiveClientsUserId = OnUserActiveClients?.userId;
      if (OnUserActiveClientsUserId !== _id) {
        userActiveClientsClient.writeQuery({
          query: USER_ACTIVE_CLIENTS_QUERY,
          data: {
            userActiveClients: OnUserActiveClients,
          },
          variables: { userId: OnUserActiveClientsUserId },
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

  const groupAllMessages = (arr1: any[], arr2?: any[]) => {
    let edges = [];

    if (arr1?.length && arr2?.length) {
      edges = groupMessages([...arr1, ...arr2], _id);
    } else if (arr1?.length) {
      edges = groupMessages(arr1, _id);
    } else if (arr2?.length) {
      edges = groupMessages(arr2, _id);
    }

    return edges;
  };

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

  const getQueuedMessages = async (id: string, key: string) => {
    const res = await MessageQueue.getQueuedMessagesById(id, key, 25, 0);
    setLoadingQueued(false);
    return res;
  };

  const getChatMessagesWithQueue = async (id: string, key: string) => {
    try {
      const [cachedMessageGroups, fetchedQueuedMessages]: any =
        await Promise.all([
          messageGroupsClient.readQuery({
            query: MESSAGE_GROUPS_QUERY,
            variables: { chatId: id },
          }),
          getQueuedMessages(id, key),
        ]);

      let edges: any[] = [];
      let pageInfo = {
        endCursor: '',
        hasNextPage: false,
      };
      let queuedPageInfo = {
        endCursor: '',
        hasNextPage: false,
      };
      let scrollPosition = -1;
      let isWrite = false;

      if (cachedMessageGroups) {
        const cachedData = cachedMessageGroups?.messageGroups;
        edges = cachedData?.edges;
        pageInfo = cachedData?.pageInfo;
        queuedPageInfo = cachedData?.queuedPageInfo;
        scrollPosition = cachedData?.scrollPosition;

        if (edges?.length) {
          const firstGroup = edges?.[0];
          const firstGroupDateLabel = firstGroup?.dateLabel;
          const firstGroupData = firstGroup?.groups?.[0]?.data?.[0];
          const firstGroupDataTimestamp = firstGroupData?.timestamp;
          const dateLabel = firstGroupDataTimestamp
            ? getDateLabel(firstGroupDataTimestamp)
            : '';
          if (
            firstGroupDateLabel &&
            dateLabel &&
            firstGroupDateLabel !== dateLabel
          ) {
            const unGroupedMessages = unGroupMessages(edges);
            edges = groupMessages(unGroupedMessages, _id);
            scrollPosition = -1;
            isWrite = true;
          }

          if (fetchedQueuedMessages?.length) {
            const uniqueMessages = uniqueQueuedMessages(
              edges,
              fetchedQueuedMessages,
            );

            if (uniqueMessages?.length) {
              const groupedUniqueMessages = groupMessages(uniqueMessages, _id);
              edges = mergeAllByDateLabel(edges, groupedUniqueMessages);
              scrollPosition = -1;
              isWrite = true;
            }
          }
        }
      } else {
        if (key === 'chatId') {
          setIsRefetchingMessages(true);
          const fetchedData = await fetchMessages(id);
          const fetchedMessages = fetchedData?.data?.messages;
          const fetchedMessagesEdges = fetchedMessages?.edges;
          const fetchedMessagesPageInfo = fetchedMessages?.pageInfo;
          edges = groupAllMessages(fetchedMessagesEdges, fetchedQueuedMessages);
          pageInfo = fetchedMessagesPageInfo;
          queuedPageInfo = fetchedMessagesPageInfo;
          scrollPosition = -1;
          isWrite = true;
        }

        if (key === 'friendId') {
          edges = groupMessages(fetchedQueuedMessages, _id);
          scrollPosition = -1;
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
                const sortedData = sortByTimestamp(data);
                return sortedData;
              }
              return existingData;
            },
          },
        });

        messageGroupsClient.writeQuery({
          query: MESSAGE_GROUPS_QUERY,
          data: {
            messageGroups: {
              edges,
              pageInfo,
              queuedPageInfo,
              scrollPosition,
            },
          },
          variables: { chatId: id },
        });
      }

      if (scrollPosition === -1) {
        setScrollToBottom((prev) => !prev);
      }

      if (scrollPosition >= 0) {
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
        // messages
        messages,
        messagesPageInfo,
        messagesLoading,
        messagesError,
        messagesClient,
        messagesCalled,
        subscribeMessagesToMore,
        fetchMoreMessages,
        refetchMessages,
        // messageGroups
        messageGroups,
        messageGroupsPageInfo,
        messageGroupsQueuedPageInfo,
        messageGroupsScrollPosition,
        messageGroupsLoading,
        messageGroupsError,
        messageGroupsClient,
        messageGroupsCalled,
        subscribeMessageGroupsToMore,
        // userActiveClients
        userActiveClients,
        userActiveClientsLoading,
        userActiveClientsError,
        userActiveClientsClient,
        userActiveClientsCalled,
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
        // OnSessionActiveClients
        OnSessionActiveClients,
        OnSessionActiveClientsLoading,
        OnSessionActiveClientsError,
        // OnUserActiveClients
        OnUserActiveClients,
        OnUserActiveClientsLoading,
        OnUserActiveClientsError,

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
        groupAllMessages,
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
