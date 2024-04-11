import { Dispatch, SetStateAction, useState } from 'react';
import { useLazyQuery, useSubscription } from '@apollo/client';
import { useAuth } from '..';
import {
  MESSAGES_QUERY,
  MESSAGE_ADDED_SUBSCRIPTION,
  MESSAGES_ADDED_SUBSCRIPTION,
  MESSAGES_UPDATED_SUBSCRIPTION,
  // CREATE_MESSAGE_MUTATION,
  // UPDATE_MESSAGE_MUTATION,
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

export const useMessages = (
  chatId?: string,
  setMessagesQueue?: Dispatch<SetStateAction<string[]>>,
) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [messageGroups, setMessageGroups] = useState<any[]>([]);
  const { auth: { _id = '' } = {} } = useAuth();

  const messagesWithQueue = (msgs: any) => {
    setMessagesQueue?.((prev: any[]) => {
      if (prev?.length && msgs?.length) {
        const queue = prev?.filter(
          (el: any) =>
            !msgs?.some(
              (el2: any) =>
                el?.timestamp === el2?.sender?.sentStatus?.timestamp,
            ),
        );
        return queue;
      }
      return prev;
    });
    setMessages(msgs);
    const messageGroupsData = makeMessageGroups(msgs, _id);
    setMessageGroups(messageGroupsData);
  };

  const [
    getMessages,
    {
      client,
      refetch: refetchMessages,
      data: messagesData,
      loading: loadingMessages,
      error: errorMessages,
    },
  ] = useLazyQuery(MESSAGES_QUERY);

  // const [
  //   createMessage,
  //   { loading: loadingCreateMessage, error: errorCreateMessage },
  // ] = useMutation(CREATE_MESSAGE_MUTATION);

  // const [
  //   updateMessage,
  //   { loading: loadingUpdateMessage, error: errorUpdateMessage },
  // ] = useMutation(UPDATE_MESSAGE_MUTATION);

  const { loading: loadingOnMessageAdded, error: errorOnMessageAdded } =
    useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
      // variables: {
      //   isDelivered: true,
      // },
      onData: (res) => {
        // const OnMessageAdded = res?.data?.data?.OnMessageAdded;
        // const OnMessagesAddedUserId = OnMessagesAdded?.userId;
        // const OnMessageAddedChatId = OnMessageAdded?.chatId;
        // const OnMessageAddedData = OnMessageAdded?.data;
        // const OnMessageAddedMessageId = OnMessageAdded?._id;
        // if (
        //   OnMessagesAddedUserId === _id &&
        //   OnMessageAddedChatId !== chatId
        // ) {
        //   updateMessage({
        //     variables: {
        //       messageId: OnMessageAddedChatId,
        //       receivedStatus: 'unread',
        //     },
        //   });
        // }
      },
    });

  const { loading: loadingOnMessagesAdded, error: errorOnMessagesAdded } =
    useSubscription(MESSAGES_ADDED_SUBSCRIPTION, {
      onData: async (res) => {
        await client?.clearStore();
        const OnMessagesAdded = res?.data?.data?.OnMessagesAdded;
        const OnMessagesAddedUserId = OnMessagesAdded?.userId;
        const OnMessagesAddedChatId = OnMessagesAdded?.chatId;
        const OnMessagesAddedData = OnMessagesAdded?.data;
        if (OnMessagesAddedUserId === _id && OnMessagesAddedChatId === chatId) {
          messagesWithQueue(OnMessagesAddedData);
        }
      },
    });

  const { loading: loadingOnMessagesUpdated, error: errorOnMessagesUpdated } =
    useSubscription(MESSAGES_UPDATED_SUBSCRIPTION);

  return {
    getMessages,
    // createMessage,
    // updateMessage,
    client,
    messagesData,
    loadingMessages,
    // loadingCreateMessage,
    // loadingUpdateMessage,
    loadingOnMessageAdded,
    loadingOnMessagesAdded,
    loadingOnMessagesUpdated,
    errorMessages,
    // errorCreateMessage,
    // errorUpdateMessage,
    errorOnMessageAdded,
    errorOnMessagesAdded,
    errorOnMessagesUpdated,
    messages,
    setMessages,
    makeMessageGroups,
    messageGroups,
    setMessageGroups,
    messagesWithQueue,
    refetchMessages,
  };
};
