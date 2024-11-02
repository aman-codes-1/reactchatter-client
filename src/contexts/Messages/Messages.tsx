import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from '@apollo/client';
import {
  MESSAGES_QUERY,
  MESSAGE_GROUPS_QUERY,
  MESSAGE_QUEUED_QUERY,
  CREATE_MESSAGE_MUTATION,
  UPDATE_MESSAGE_MUTATION,
  MESSAGE_ADDED_SUBSCRIPTION,
  MESSAGE_UPDATED_SUBSCRIPTION,
} from './gql';
import {
  getDateLabel,
  groupMessage,
  groupMessages,
  mergeAllByDateLabel,
  unGroupMessages,
  uniqueArrayElements,
  updateGroupedQueuedMessage,
} from '../../helpers';
import { useAuth } from '../../hooks';
import { MessageQueueService } from '../../services';
// import { ChatsAndFriendsContext } from '..';

export const MessagesContext = createContext<any>({});

export const MessagesProvider = ({ children }: any) => {
  const MessageQueue = new MessageQueueService();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatId =
    searchParams.get('type') === 'chat' ? searchParams.get('id') : null;
  const friendId =
    searchParams.get('type') === 'friend' ? searchParams.get('id') : null;
  const [loadingChatMessages, setLoadingChatMessages] = useState(true);
  const [loadingCreateMessage, setLoadingCreateMessage] = useState(false);
  // const [loadingProcessNextMessage, setLoadingProcessNextMessage] = useState(false);
  const [queuedMessages, setQueuedMessages] = useState<any[]>([]);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [scrollToPosition, setScrollToPosition] = useState(false);
  const { auth: { _id = '' } = {} } = useAuth();
  // const { createChat } = useContext(ChatsAndFriendsContext);

  const [
    messageQueuedQuery,
    {
      data: messageQueued,
      loading: messageQueuedLoading,
      error: messageQueuedError,
      client: messageQueuedClient,
      called: messageQueuedCalled,
    },
  ] = useLazyQuery(MESSAGE_QUEUED_QUERY);

  const [
    messagesQuery,
    {
      data: {
        messages: {
          edges: messages = [],
          pageInfo: messagesPageInfo = {},
        } = {},
      } = {},
      loading: messagesLoading,
      error: messagesError,
      client: messagesClient,
      called: messagesCalled,
      subscribeToMore: subscribeMessagesToMore,
      fetchMore: fetchMoreMessages,
    },
  ] = useLazyQuery(MESSAGES_QUERY);

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
    variables: { chatId },
    skip: !chatId || !!friendId,
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: OnMessageAddedData,
    loading: OnMessageAddedLoading,
    error: OnMessageAddedError,
  } = useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    onData: async (res) => {
      const OnMessageAdded = res?.data?.data?.OnMessageAdded;
      const OnMessageAddedChatId = OnMessageAdded?.chatId;
      const OnMessageAddedMessage = OnMessageAdded?.message;
      const OnMessageAddedQueueId = OnMessageAddedMessage?.queueId;

      const isAlreadyExists = messageGroups?.length
        ? messageGroups?.some((cachedMessageGroup: any) =>
            cachedMessageGroup?.groups?.some((group: any) =>
              group?.data?.some(
                (msg: any) => msg?._id === OnMessageAddedMessage?._id,
              ),
            ),
          )
        : false;

      const isChatExists = OnMessageAddedChatId === chatId;

      if (!isAlreadyExists && isChatExists) {
        let edges = [];
        const pageInfo = {
          endCursor: OnMessageAddedMessage?._id,
          hasNextPage: false,
        };
        const queuedPageInfo = {
          endCursor: '',
          hasNextPage: false,
        };

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

        if (edges?.length) {
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
                  : queuedPageInfo,
                scrollPosition: -1,
              },
            },
            variables: { chatId },
          });

          setScrollToBottom((prev) => !prev);
        }
      }
    },
  });

  const {
    data: OnMessageUpdatedData,
    loading: OnMessageUpdatedLoading,
    error: OnMessageUpdatedError,
  } = useSubscription(MESSAGE_UPDATED_SUBSCRIPTION);

  const [
    createMessage,
    {
      data: createMessageData,
      loading: createMessageLoading,
      error: createMessageError,
    },
  ] = useMutation(CREATE_MESSAGE_MUTATION);

  const [
    updateMessage,
    {
      data: updateMessageData,
      loading: updateMessageLoading,
      error: updateMessageError,
    },
  ] = useMutation(UPDATE_MESSAGE_MUTATION);

  // useEffect(() => { // to do
  //   const messageQueueService = new MessageQueueService(
  //     createChat,
  //     createMessage,
  //     setLoadingProcessNextMessage,
  //   );

  //   const startQueueProcessing = async () => {
  //     if (loadingCreateMessage || loadingProcessNextMessage || OnMessageAddedLoading) return;
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
  //     if (name === 'visibilitychange') {
  //       document.addEventListener(name, handler);
  //     } else {
  //       window.addEventListener(name, handler);
  //     }
  //   });

  //   return () => {
  //     events.forEach(({ name, handler }) => {
  //       if (name === 'visibilitychange') {
  //         document.removeEventListener(name, handler);
  //       } else {
  //         window.removeEventListener(name, handler);
  //       }
  //     });
  //   };
  // }, [loadingCreateMessage, loadingProcessNextMessage, OnMessageAddedLoading]);

  const getQueuedMessages = async (
    id: string,
    key: string,
    isChat?: boolean,
  ) => {
    const res = await MessageQueue.getQueuedMessagesById(id, key, 25, 0);

    if (res?.length && !isChat) {
      const groupedMessages = groupMessages(res, _id);

      setQueuedMessages((prev) => {
        const prevCopy = [...prev];
        const friendIndex = prev?.findIndex((el) => el?.friendId === id);

        if (friendIndex < 0) {
          const newMessageGroup = {
            friendId: id,
            messageGroups: groupedMessages,
          };

          prevCopy?.push(newMessageGroup);
        } else {
          prevCopy[friendIndex] = {
            ...prevCopy[friendIndex],
            messageGroups: groupedMessages,
          };
        }

        return prevCopy;
      });

      setScrollToBottom((prev: boolean) => !prev);
    }

    return res;
  };

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
    const res = await messagesQuery({
      variables: { chatId: id },
      fetchPolicy: 'no-cache',
    });

    const error = res?.error?.message;

    if (error) {
      if (error?.includes('Chat not found')) {
        navigate('/');
      }

      throw new Error(error);
    }

    return res;
  };

  const getChatMessagesWithQueue = async (id: string, key: string) => {
    try {
      const cachedMessageGroups = await messageGroupsClient.readQuery({
        query: MESSAGE_GROUPS_QUERY,
        variables: { chatId: id },
      });

      const fetchedQueuedMessages =
        (await getQueuedMessages(id, key, true)) || [];

      let edges = [];
      let pageInfo = {
        endCursor: '',
        hasNextPage: false,
      };
      let queuedPageInfo = {
        endCursor: '',
        hasNextPage: false,
      };
      let scrollPosition = -1;

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
          }

          if (fetchedQueuedMessages?.length) {
            const uniqueQueuedMessages = uniqueArrayElements(
              edges,
              fetchedQueuedMessages,
            );

            if (uniqueQueuedMessages?.length) {
              const groupedMessages = groupMessages(uniqueQueuedMessages, _id);
              edges = mergeAllByDateLabel(edges, groupedMessages);
              scrollPosition = -1;
            }
          }
        }
      } else {
        const fetchedData = await fetchMessages(id);
        const fetchedMessages = fetchedData?.data?.messages;
        const fetchedMessagesEdges = fetchedMessages?.edges;
        const fetchedMessagesPageInfo = fetchedMessages?.pageInfo;
        edges = groupAllMessages(fetchedMessagesEdges, fetchedQueuedMessages);
        pageInfo = fetchedMessagesPageInfo;
        queuedPageInfo = fetchedMessagesPageInfo;
        scrollPosition = -1;
      }

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

  return (
    <MessagesContext.Provider
      value={{
        // messageQueued
        messageQueuedQuery,
        messageQueued,
        messageQueuedLoading,
        messageQueuedError,
        messageQueuedClient,
        messageQueuedCalled,
        // messages
        messagesQuery,
        messages,
        messagesPageInfo,
        messagesLoading,
        messagesError,
        messagesClient,
        messagesCalled,
        subscribeMessagesToMore,
        fetchMoreMessages,
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
        // OnMessageAdded
        OnMessageAddedData,
        OnMessageAddedLoading,
        OnMessageAddedError,
        // OnMessageUpdated
        OnMessageUpdatedData,
        OnMessageUpdatedLoading,
        OnMessageUpdatedError,
        // createMessage
        createMessage,
        createMessageData,
        createMessageLoading,
        createMessageError,
        // updateMessage
        updateMessage,
        updateMessageData,
        updateMessageLoading,
        updateMessageError,
        // loadingChatMessages
        loadingChatMessages,
        setLoadingChatMessages,
        // loadingCreateMessage
        loadingCreateMessage,
        setLoadingCreateMessage,
        // scrollToBottom
        scrollToBottom,
        setScrollToBottom,
        // scrollToPosition
        scrollToPosition,
        setScrollToPosition,
        // queuedMessages
        queuedMessages,
        setQueuedMessages,
        // getMessages
        groupAllMessages,
        fetchMessages,
        getQueuedMessages,
        getChatMessagesWithQueue,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
