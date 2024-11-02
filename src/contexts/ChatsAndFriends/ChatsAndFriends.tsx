import { createContext, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from '@apollo/client';
import {
  CHAT_QUERY,
  CHATS_QUERY,
  CREATE_CHAT_MUTATION,
  CREATE_REQUEST_MUTATION,
  FRIEND_ADDED_SUBSCRIPTION,
  PENDING_REQUESTS_QUERY,
  FRIEND_QUERY,
  OTHER_FRIENDS_QUERY,
  REQUEST_ADDED_SUBSCRIPTION,
  REQUEST_UPDATED_SUBSCRIPTION,
  SENT_REQUESTS_QUERY,
  UPDATE_REQUEST_MUTATION,
  CHAT_ADDED_SUBSCRIPTION,
} from '.';
import { useAuth } from '../../hooks';

export const ChatsAndFriendsContext = createContext<any>({});

export const ChatsAndFriendsProvider = ({ children }: any) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isListItemClicked, setIsListItemClicked] = useState(false);
  const [loadingQuery, setLoadingQuery] = useState(true);
  const [selectedItem, setSelectedItem] = useState();
  const { auth: { _id = '' } = {} } = useAuth();

  const [
    chatQuery,
    {
      data: chat,
      loading: chatLoading,
      error: chatError,
      client: chatClient,
      called: chatCalled,
    },
  ] = useLazyQuery(CHAT_QUERY, {
    onCompleted: (data) => {
      const chatData = data?.chat;
      setSelectedItem(chatData);
    },
  });

  const [
    friendQuery,
    {
      data: friend,
      loading: friendLoading,
      error: friendError,
      client: friendClient,
      called: friendCalled,
    },
  ] = useLazyQuery(FRIEND_QUERY, {
    onCompleted: (data) => {
      const friendData = data?.friend;
      if (friendData?.hasChats === true) {
        navigate('/');
      } else {
        setSelectedItem(friendData);
      }
    },
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
    fetchPolicy: 'network-only',
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
    fetchPolicy: 'network-only',
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
    fetchPolicy: 'network-only',
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
    fetchPolicy: 'network-only',
  });

  const {
    data: OnChatAddedData,
    loading: OnChatAddedLoading,
    error: OnChatAddedError,
  } = useSubscription(CHAT_ADDED_SUBSCRIPTION, {
    onData: (res) => {
      const OnChatAdded = res?.data?.data?.OnChatAdded;
      const OnChatAddedFriendId = OnChatAdded?.friendId;
      const OnChatAddedChat = OnChatAdded?.chat;
      const OnChatAddedMembers = OnChatAddedChat?.members;
      const isChatAddedPrivate = OnChatAddedChat?.type === 'private';

      const isAlreadyExists = chats?.length
        ? chats?.some((chat: any) => chat?._id === OnChatAddedChat?._id)
        : false;

      const isMemberExists = OnChatAddedMembers?.length
        ? OnChatAddedMembers.some((member: any) => member?._id === _id)
        : false;

      if (!isAlreadyExists && isMemberExists) {
        if (isChatAddedPrivate) {
          otherFriendsClient.writeQuery({
            query: OTHER_FRIENDS_QUERY,
            data: {
              otherFriends: otherFriends?.length
                ? otherFriends?.filter(
                    (otherFriend: any) =>
                      otherFriend?._id !== OnChatAddedFriendId,
                  )
                : otherFriends,
            },
            variables: {
              userId: _id,
            },
          });
        }

        setSelectedItem(OnChatAddedChat);

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
    },
  });

  const {
    data: OnFriendAddedData,
    loading: OnFriendAddedLoading,
    error: OnFriendAddedError,
  } = useSubscription(FRIEND_ADDED_SUBSCRIPTION, {
    onData: (res: any) => {
      const OnFriendAdded = res?.data?.data?.OnFriendAdded;
      const OnFriendAddedFriend = OnFriendAdded?.friend;
      const OnFriendAddedMembers = OnFriendAddedFriend?.members;

      const isMemberExists = OnFriendAddedMembers?.length
        ? OnFriendAddedMembers?.some((member: any) => member?._id === _id)
        : false;

      if (isMemberExists) {
        otherFriendsClient.writeQuery({
          query: OTHER_FRIENDS_QUERY,
          data: {
            otherFriends: Object.keys(OnFriendAddedFriend || {})?.length
              ? [OnFriendAddedFriend, ...otherFriends]
              : otherFriends,
          },
          variables: {
            userId: _id,
          },
        });
      }
    },
  });

  const checkIsMember = (OnRequestMembers: any) => {
    let isMemberExists = false;
    let isMemberExists2 = false;

    if (OnRequestMembers?.length) {
      OnRequestMembers?.forEach((member: any) => {
        if (member?._id === _id) {
          if (member?.hasSent === true) {
            isMemberExists = true;
          } else if (member?.hasSent === false) {
            isMemberExists2 = true;
          }
        }
      });
    }

    return { isMemberExists, isMemberExists2 };
  };

  const {
    data: OnRequestAddedData,
    loading: OnRequestAddedLoading,
    error: OnRequestAddedError,
  } = useSubscription(REQUEST_ADDED_SUBSCRIPTION, {
    onData: (res) => {
      const OnRequestAdded = res?.data?.data?.OnRequestAdded;
      const OnRequestAddedRequest = OnRequestAdded?.request;
      const OnRequestAddedMembers = OnRequestAddedRequest?.members;

      const { isMemberExists, isMemberExists2 } = checkIsMember(
        OnRequestAddedMembers,
      );

      if (isMemberExists) {
        sentRequestsClient.writeQuery({
          query: SENT_REQUESTS_QUERY,
          data: {
            sentRequests: {
              data: Object.keys(OnRequestAddedRequest || {})?.length
                ? [OnRequestAddedRequest, ...sentRequests]
                : sentRequests,
              totalCount: sentRequestsCount + 1,
            },
          },
          variables: {
            userId: _id,
          },
        });
      }

      if (isMemberExists2) {
        pendingRequestsClient.writeQuery({
          query: PENDING_REQUESTS_QUERY,
          data: {
            pendingRequests: {
              data: Object.keys(OnRequestAddedRequest || {})?.length
                ? [OnRequestAddedRequest, ...pendingRequests]
                : pendingRequests,
              totalCount: pendingRequestsCount + 1,
            },
          },
          variables: {
            userId: _id,
          },
        });
      }
    },
  });

  const {
    data: OnRequestUpdatedData,
    loading: OnRequestUpdatedLoading,
    error: OnRequestUpdatedError,
  } = useSubscription(REQUEST_UPDATED_SUBSCRIPTION, {
    onData: (res) => {
      const OnRequestUpdated = res?.data?.data?.OnRequestUpdated;
      const OnRequestUpdatedRequest = OnRequestUpdated?.request;
      const OnRequestUpdatedMembers = OnRequestUpdatedRequest?.members;

      const { isMemberExists, isMemberExists2 } = checkIsMember(
        OnRequestUpdatedMembers,
      );

      if (isMemberExists) {
        sentRequestsClient.writeQuery({
          query: SENT_REQUESTS_QUERY,
          data: {
            sentRequests: {
              data: sentRequests?.length
                ? sentRequests?.filter(
                    (sentRequest: any) =>
                      sentRequest?._id !== OnRequestUpdatedRequest?._id,
                  )
                : sentRequests,
              totalCount: sentRequestsCount - 1,
            },
          },
          variables: {
            userId: _id,
          },
        });
      }

      if (isMemberExists2) {
        pendingRequestsClient.writeQuery({
          query: PENDING_REQUESTS_QUERY,
          data: {
            pendingRequests: {
              data: pendingRequests?.length
                ? pendingRequests?.filter(
                    (request: any) =>
                      request?._id !== OnRequestUpdatedRequest?._id,
                  )
                : pendingRequests,
              totalCount: pendingRequestsCount - 1,
            },
          },
          variables: {
            userId: _id,
          },
        });
      }
    },
  });

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
    }
  }, [pathname]);

  return (
    <ChatsAndFriendsContext.Provider
      value={{
        // chat
        chatQuery,
        chat,
        chatLoading,
        chatError,
        chatClient,
        chatCalled,
        // friend
        friendQuery,
        friend,
        friendLoading,
        friendError,
        friendClient,
        friendCalled,
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
        // OnChatAdded
        OnChatAddedData,
        OnChatAddedLoading,
        OnChatAddedError,
        // OnFriendAdded
        OnFriendAddedData,
        OnFriendAddedLoading,
        OnFriendAddedError,
        // OnRequestAdded
        OnRequestAddedData,
        OnRequestAddedLoading,
        OnRequestAddedError,
        // OnRequestUpdated
        OnRequestUpdatedData,
        OnRequestUpdatedLoading,
        OnRequestUpdatedError,
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
        // isListItemClicked
        isListItemClicked,
        setIsListItemClicked,
        // loadingQuery
        loadingQuery,
        setLoadingQuery,
        // selectedItem
        selectedItem,
        setSelectedItem,
      }}
    >
      {children}
    </ChatsAndFriendsContext.Provider>
  );
};
