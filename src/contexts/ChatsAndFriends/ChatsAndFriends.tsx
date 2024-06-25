import { createContext, useLayoutEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  CHAT_QUERY,
  CHATS_QUERY,
  CREATE_CHAT_MUTATION,
  CREATE_REQUEST_MUTATION,
  FRIEND_ADDED_SUBSCRIPTION,
  PENDING_REQUESTS_QUERY,
  OTHER_FRIENDS_QUERY,
  REQUEST_ADDED_SUBSCRIPTION,
  REQUEST_UPDATED_SUBSCRIPTION,
  SENT_REQUESTS_QUERY,
  UPDATE_REQUEST_MUTATION,
} from '.';
import { useAuth, useSocket } from '../../hooks';

export const ChatsAndFriendsContext = createContext<any>({});

export const ChatsAndFriendsProvider = ({ children }: any) => {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('id');
  const { pathname } = useLocation();
  const [selectedChat, setSelectedChat] = useState();
  const [selectedFriend, setSelectedFriend] = useState();
  const [activeMember, setActiveMember] = useState();
  const { auth: { _id = '' } = {} } = useAuth();
  const { isLoading: isSocketLoading } = useSocket();

  const {
    data: { chats = [] } = {},
    loading: chatsLoading,
    error: chatsError,
    client: chatsClient,
    called: chatsCalled,
    subscribeToMore: subscribeChatsToMore,
  } = useQuery(CHATS_QUERY, {
    variables: {
      userId: _id,
    },
    fetchPolicy: 'network-only',
    skip: isSocketLoading,
  });

  const {
    data: chat,
    loading: chatLoading,
    error: chatError,
    called: chatCalled,
  } = useQuery(CHAT_QUERY, {
    variables: {
      chatId,
    },
    fetchPolicy: 'network-only',
    skip:
      isSocketLoading ||
      !chatId ||
      (chatsCalled &&
        !chatsLoading &&
        chats?.length &&
        chatId &&
        chats?.find((el: any) => el?._id === chatId)),
  });

  const {
    data: { otherFriends = [] } = {},
    loading: otherFriendsLoading,
    error: otherFriendsError,
    client: otherFriendsClient,
    called: otherFriendsCalled,
    subscribeToMore: subscribeOtherFriendsToMore,
  } = useQuery(OTHER_FRIENDS_QUERY, {
    variables: {
      userId: _id,
    },
    fetchPolicy: 'network-only',
    skip: isSocketLoading,
  });

  const [
    createChat,
    {
      data: createChatData,
      loading: createChatLoading,
      error: createChatError,
    },
  ] = useMutation(CREATE_CHAT_MUTATION);

  const {
    data: OnFriendAddedData,
    loading: OnFriendAddedLoading,
    error: OnFriendAddedError,
  } = useSubscription(FRIEND_ADDED_SUBSCRIPTION, {
    onData: (res: any) => {
      const OnFriendAdded = res?.data?.data?.OnFriendAdded;
      const OnFriendAddedFriend = OnFriendAdded?.friend;
      const OnFriendAddedMembers = OnFriendAddedFriend?.members;
      if (
        OnFriendAddedMembers?.length &&
        OnFriendAddedMembers?.some(
          (OnFriendAddedMember: any) => OnFriendAddedMember?._id === _id,
        )
      ) {
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
  } = useQuery(PENDING_REQUESTS_QUERY, {
    variables: {
      userId: _id,
    },
    skip: isSocketLoading,
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
  } = useQuery(SENT_REQUESTS_QUERY, {
    variables: {
      userId: _id,
    },
    skip: isSocketLoading,
  });

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

  const {
    data: OnRequestAddedData,
    loading: OnRequestAddedLoading,
    error: OnRequestAddedError,
  } = useSubscription(REQUEST_ADDED_SUBSCRIPTION, {
    onData: (res) => {
      const OnRequestAdded = res?.data?.data?.OnRequestAdded;
      const OnRequestAddedRequest = OnRequestAdded?.request;
      const OnRequestAddedMembers = OnRequestAddedRequest?.members;
      if (OnRequestAddedMembers?.length) {
        if (
          OnRequestAddedMembers?.some(
            (member: any) => member?._id === _id && member?.hasSent === true,
          )
        ) {
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
        if (
          OnRequestAddedMembers?.some(
            (member: any) => member?._id === _id && member?.hasSent === false,
          )
        ) {
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
      if (OnRequestUpdatedMembers?.length) {
        if (
          OnRequestUpdatedMembers?.some(
            (member: any) => member?._id === _id && member?.hasSent === true,
          )
        ) {
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
        if (
          OnRequestUpdatedMembers?.some(
            (member: any) => member?._id === _id && member?.hasSent === false,
          )
        ) {
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
      }
    },
  });

  useLayoutEffect(() => {
    if (pathname !== '/chat' || (pathname?.includes('/chat') && chatId)) {
      setSelectedChat(undefined);
      setSelectedFriend(undefined);
      setActiveMember(undefined);
    }
  }, [pathname, chatId]);

  useLayoutEffect(() => {
    if (chats?.length && chatId) {
      setSelectedChat(chats?.find((el: any) => el?._id === chatId));
    }
  }, [chats, chatId]);

  return (
    <ChatsAndFriendsContext.Provider
      value={{
        // chats
        chat,
        chats,
        chatLoading,
        chatCalled,
        chatsLoading,
        chatError,
        chatsError,
        chatsClient,
        chatsCalled,
        subscribeChatsToMore,
        // otherFriends
        otherFriends,
        otherFriendsLoading,
        otherFriendsError,
        otherFriendsClient,
        otherFriendsCalled,
        subscribeOtherFriendsToMore,
        // createChat
        createChat,
        createChatData,
        createChatLoading,
        createChatError,
        // OnFriendAdded
        OnFriendAddedData,
        OnFriendAddedLoading,
        OnFriendAddedError,
        // pendingRequests
        pendingRequests,
        pendingRequestsCount,
        pendingRequestsLoading,
        pendingRequestsError,
        pendingRequestsClient,
        pendingRequestsCalled,
        // sentRequests
        sentRequests,
        sentRequestsCount,
        sentRequestsLoading,
        sentRequestsError,
        sentRequestsClient,
        sentRequestsCalled,
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
        // OnRequestAdded
        OnRequestAddedData,
        OnRequestAddedLoading,
        OnRequestAddedError,
        // OnRequestUpdated
        OnRequestUpdatedData,
        OnRequestUpdatedLoading,
        OnRequestUpdatedError,
        // selectedChat
        selectedChat,
        setSelectedChat,
        // selectedFriend
        selectedFriend,
        setSelectedFriend,
        // activeMember
        activeMember,
        setActiveMember,
      }}
    >
      {children}
    </ChatsAndFriendsContext.Provider>
  );
};
