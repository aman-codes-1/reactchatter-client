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

export const useChats = (channelId?: string) => {
  const [messageGroups, setMessageGroups] = useState<any>([]);
  const { auth: { _id = '' } = {} } = useAuth();

  const [
    getChats,
    {
      called,
      client,
      data,
      fetchMore,
      loading: loadingQuery,
      networkStatus,
      observable,
      refetch,
      reobserve,
      startPolling,
      stopPolling,
      subscribeToMore,
      updateQuery,
      variables,
      error,
      previousData,
    },
  ] = useLazyQuery(CHATS_QUERY);

  const {
    loading: loadingSubscription,
    data: dataSubscription,
    error: errorSubscription,
  } = useSubscription(CHAT_UPDATED_SUBSCRIPTION, {
    onData: (res) => {
      client.clearStore();
      const chatUpdated = res?.data?.data?.chatUpdated;
      const channelID = chatUpdated?.channelId;
      if (channelID === channelId) {
        const chatsData = makeMessageGroups(
          res?.data?.data?.chatUpdated?.data,
          _id,
        );
        setMessageGroups(chatsData);
      }
    },
  });

  const [newChat] = useMutation(CHAT_MUTATION);

  return {
    called,
    client,
    data,
    fetchMore,
    loading: loadingQuery,
    networkStatus,
    observable,
    refetch,
    reobserve,
    startPolling,
    stopPolling,
    subscribeToMore,
    updateQuery,
    variables,
    error,
    previousData,
    loadingQuery,
    getChats,
    makeMessageGroups,
    messageGroups,
    setMessageGroups,
    newChat,
  };
};
