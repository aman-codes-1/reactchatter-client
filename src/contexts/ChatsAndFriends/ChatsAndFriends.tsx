import { createContext, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  CHATS_QUERY,
  CREATE_CHAT_MUTATION,
  FRIEND_ADDED_SUBSCRIPTION,
  OTHER_FRIENDS_QUERY,
} from '.';
import { useAuth, useSocket } from '../../hooks';

export const ChatsAndFriendsContext = createContext<any>({});

export const ChatsAndFriendsProvider = ({ children }: any) => {
  const { pathname } = useLocation();
  const [chatDetails, setChatDetails] = useState();
  const { auth: { _id = '' } = {} } = useAuth();
  const { socket } = useSocket();

  const {
    data: chats,
    loading: chatsLoading,
    client: chatsClient,
    called: chatsCalled,
    subscribeToMore: subscribeChatsToMore,
  } = useQuery(CHATS_QUERY, {
    variables: {
      userId: _id,
    },
    fetchPolicy: 'network-only',
    skip: !socket,
  });

  const {
    data: otherFriends,
    loading: otherFriendsLoading,
    client: otherFriendsClient,
    called: otherFriendsCalled,
    subscribeToMore: subscribeOtherFriendsToMore,
  } = useQuery(OTHER_FRIENDS_QUERY, {
    variables: {
      userId: _id,
    },
    fetchPolicy: 'network-only',
    skip: !socket,
  });

  const [createChat] = useMutation(CREATE_CHAT_MUTATION);

  const { data: OnFriendAddedData } = useSubscription(FRIEND_ADDED_SUBSCRIPTION, {
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
              ? [OnFriendAddedFriend, ...otherFriends?.otherFriends]
              : otherFriends?.otherFriends,
          },
          variables: {
            userId: _id,
          },
        });
      }
    }
  });

  useLayoutEffect(() => {
    if (pathname !== '/chat') {
      setChatDetails(undefined);
    }
  }, [pathname]);

  return (
    <ChatsAndFriendsContext.Provider
      value={{
        chats,
        otherFriends,
        OnFriendAddedData,
        chatsLoading,
        otherFriendsLoading,
        chatsClient,
        otherFriendsClient,
        chatsCalled,
        otherFriendsCalled,
        subscribeChatsToMore,
        subscribeOtherFriendsToMore,
        createChat,
        chatDetails,
        setChatDetails,
      }}
    >
      {children}
    </ChatsAndFriendsContext.Provider>
  );
};
