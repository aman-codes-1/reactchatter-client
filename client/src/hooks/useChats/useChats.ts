import { Dispatch, SetStateAction, useState } from 'react';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/client';
import { useAuth } from '..';
import {
  CHATS_QUERY,
  CHAT_ADDED_SUBSCRIPTION,
  CHATS_ADDED_SUBSCRIPTION,
  CHATS_UPDATED_SUBSCRIPTION,
  CREATE_CHAT_MUTATION,
  UPDATE_CHAT_MUTATION,
} from './gql';

const makeMessageGroups = (Data: any, _id: string) => {
  let finalResult: never[] = [];
  if (Data && Data?.length) {
    const result = Data.reduce((acc: any, value: any) => {
      if (
        acc &&
        acc?.length &&
        acc?.[acc.length - 1]?.[0]?.sender?._id === value?.sender?._id
      ) {
        acc?.[acc.length - 1].push(value);
      } else {
        acc.push([value]);
      }
      return acc;
    }, []);
    const side1 = result?.[0]?.every((el: any) => el?.sender?._id === _id)
      ? 'right'
      : 'left';
    const side2 = side1 === 'right' ? 'left' : 'right';
    finalResult = result.map((msgs: any, i: number) => ({
      side: i % 2 === 0 ? side1 : side2,
      data: msgs,
    }));
    return finalResult;
  }
  return finalResult;
};

export const useChats = (
  friendId?: string,
  setMessagesQueue?: Dispatch<SetStateAction<string[]>>,
) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [messageGroups, setMessageGroups] = useState<any[]>([]);
  const { auth: { _id = '' } = {} } = useAuth();

  const chatsWithQueue = (chats: any) => {
    setMessagesQueue?.((prev: any[]) => {
      if (prev?.length && chats?.length) {
        const queue = prev?.filter(
          (el: any) =>
            !chats?.some(
              (el2: any) =>
                el?.timestamp === el2?.sender?.sentStatus?.timestamp,
            ),
        );
        return queue;
      }
      return prev;
    });
    setMessages(chats);
    const messageGroupsData = makeMessageGroups(chats, _id);
    setMessageGroups(messageGroupsData);
  };

  const [
    getChats,
    {
      client,
      refetch: refetchChats,
      data: chatsData,
      loading: loadingChatsQuery,
      error: errorChatsQuery,
    },
  ] = useLazyQuery(CHATS_QUERY);

  const [
    createChat,
    { loading: loadingCreateChatMutation, error: errorCreateChatMutation },
  ] = useMutation(CREATE_CHAT_MUTATION);

  const [
    updateChat,
    { loading: loadingUpdateChatMutation, error: errorUpdateChatMutation },
  ] = useMutation(UPDATE_CHAT_MUTATION);

  const {
    loading: loadingOnChatAddedSubscription,
    error: errorOnChatAddedSubscription,
  } = useSubscription(CHAT_ADDED_SUBSCRIPTION, {
    // variables: {
    //   isDelivered: true,
    // },
    onData: (res) => {
      // const OnChatAdded = res?.data?.data?.OnChatAdded;
      // const OnChatAddedFriendId = OnChatAdded?.friendId;
      // const OnChatAddedChat = OnChatAdded?.chat;
      // const OnChatAddedMessageId = OnChatAddedData?._id;
      // if (
      //   friendId &&
      //   OnChatAddedFriendId !== friendId &&
      //   OnChatAddedMessageId
      // ) {
      //   updateChat({
      //     variables: {
      //       messageId: OnChatAddedMessageId,
      //       receivedStatus: 'unread',
      //     },
      //   });
      // }
    },
  });

  const {
    loading: loadingOnChatsAddedSubscription,
    error: errorOnChatsAddedSubscription,
  } = useSubscription(CHATS_ADDED_SUBSCRIPTION, {
    onData: async (res) => {
      await client?.clearStore();
      const OnChatsAdded = res?.data?.data?.OnChatsAdded;
      const OnChatsAddedFriendId = OnChatsAdded?.friendId;
      const OnChatsAddedChats = OnChatsAdded?.data;
      if (OnChatsAddedFriendId === friendId) {
        chatsWithQueue(OnChatsAddedChats);
      }
    },
  });

  const {
    loading: loadingOnChatsUpdatedSubscription,
    error: errorOnChatsUpdatedSubscription,
  } = useSubscription(CHATS_UPDATED_SUBSCRIPTION, {});

  return {
    getChats,
    createChat,
    client,
    chatsData,
    loadingChatsQuery,
    loadingCreateChatMutation,
    loadingUpdateChatMutation,
    loadingOnChatAddedSubscription,
    loadingOnChatsAddedSubscription,
    loadingOnChatsUpdatedSubscription,
    errorChatsQuery,
    errorCreateChatMutation,
    errorUpdateChatMutation,
    errorOnChatAddedSubscription,
    errorOnChatsAddedSubscription,
    errorOnChatsUpdatedSubscription,
    messages,
    setMessages,
    makeMessageGroups,
    messageGroups,
    setMessageGroups,
    chatsWithQueue,
    refetchChats,
  };
};
