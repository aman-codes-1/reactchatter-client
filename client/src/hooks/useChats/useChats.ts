import { Dispatch, SetStateAction, useState } from 'react';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/client';
import { useAuth } from '..';
import { CHATS_QUERY, CHAT_MUTATION, CHAT_UPDATED_SUBSCRIPTION } from './gql';

const makeMessageGroups = (Data: any, _id: string) => {
  let finalResult: never[] = [];
  if (Data && Data?.length) {
    const result = Data.reduce((acc: any, value: any) => {
      if (
        acc &&
        acc?.length &&
        acc?.[acc.length - 1]?.[0]?.sentByUserId === value?.sentByUserId
      ) {
        acc?.[acc.length - 1].push(value);
      } else {
        acc.push([value]);
      }
      return acc;
    }, []);
    const side1 = result?.[0]?.every((el: any) => el?.sentByUserId === _id)
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
  channelId?: string,
  setMessagesQueue?: Dispatch<SetStateAction<string[]>>,
) => {
  const [messages, setMessages] = useState<any>([]);
  const [messageGroups, setMessageGroups] = useState<any>([]);
  const { auth: { _id = '' } = {} } = useAuth();

  const [getChats, { client, loading: loadingQuery, error: errorQuery }] =
    useLazyQuery(CHATS_QUERY);

  const { loading: loadingSubscription, error: errorSubscription } =
    useSubscription(CHAT_UPDATED_SUBSCRIPTION, {
      onData: (res) => {
        client?.clearStore();
        const chatUpdated = res?.data?.data?.chatUpdated;
        const channelID = chatUpdated?.channelId;
        const chatUpdatedData = res?.data?.data?.chatUpdated?.data;
        if (channelID === channelId) {
          setMessagesQueue?.((prev) => {
            if (prev?.length && chatUpdatedData?.length) {
              const queue = prev?.filter(
                (el: any) =>
                  !chatUpdatedData?.some(
                    (el2: any) => el?.timestamp === el2?.timestamp,
                  ),
              );
              return queue;
            }
            return prev;
          });
          setMessages(chatUpdatedData);
          const messageGroupsData = makeMessageGroups(chatUpdatedData, _id);
          setMessageGroups(messageGroupsData);
        }
      },
    });

  const [newChat, { loading: loadingMutation, error: errorMutation }] =
    useMutation(CHAT_MUTATION);

  return {
    getChats,
    newChat,
    client,
    loadingQuery,
    loadingSubscription,
    loadingMutation,
    errorQuery,
    errorSubscription,
    errorMutation,
    messages,
    setMessages,
    makeMessageGroups,
    messageGroups,
    setMessageGroups,
  };
};
