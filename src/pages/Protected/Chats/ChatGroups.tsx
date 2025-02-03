import { RefObject, useContext, useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InfiniteScroll } from '../../../components';
import {
  CACHED_MESSAGES_QUERY,
  ChatsAndFriendsContext,
  DrawerContext,
} from '../../../contexts';
import {
  addArray,
  addObject,
  debounce,
  sortByTimestamp,
} from '../../../helpers';
import ChatMessage from './ChatMessage';
import { ChatGroupsStyled } from './Chats.styled';

const ChatGroups = ({ appBarHeight, textFieldHeight }: any) => {
  const [searchParams] = useSearchParams();
  const chatId =
    searchParams.get('type') === 'chat' ? searchParams.get('id') : null;
  const fullFriendId =
    searchParams.get('type') === 'friend' ? searchParams.get('id') : null;
  const {
    cachedMessagesClient,
    messages = [],
    messagesPageInfo,
    messagesScrollPosition,
    fetchMoreMessages,
    scrollToBottom,
    scrollToPosition,
    isFetchingMessages,
    getQueuedMessages,
    getChatMessagesWithQueue,
  } = useContext(ChatsAndFriendsContext);
  const { navbarHeight } = useContext(DrawerContext);

  useLayoutEffect(() => {
    const fetchQueuedMessages = async () => {
      if (fullFriendId) {
        await getChatMessagesWithQueue(fullFriendId, 'friend');
      }
    };

    fetchQueuedMessages();
  }, []);

  const loadMore = async (containerRef: RefObject<HTMLDivElement>) => {
    try {
      const res = await fetchMoreMessages({
        variables: {
          chatId,
          after: messagesPageInfo?.endCursor,
          updateQuery: (prev: any, { fetchMoreResult }: any) => {
            if (!fetchMoreResult) return prev;
            return {
              messages: fetchMoreResult?.messages,
            };
          },
        },
      });

      const moreMessagesData = res?.data;
      const moreMessages = moreMessagesData?.messages;
      let moreMessagesEdges = moreMessages?.edges;
      const moreMessagesPageInfo = moreMessages?.pageInfo;
      const newEdges = addObject(messages?.[0], moreMessagesEdges);

      const fetchedQueuedMessages = await getQueuedMessages(
        chatId,
        newEdges,
        moreMessagesPageInfo,
      );

      if (fetchedQueuedMessages?.length) {
        moreMessagesEdges = sortByTimestamp([
          ...moreMessagesEdges,
          ...fetchedQueuedMessages,
        ]);
      }

      const edges = addArray(messages, moreMessagesEdges);

      cachedMessagesClient.writeQuery({
        query: CACHED_MESSAGES_QUERY,
        data: {
          cachedMessages: {
            edges,
            pageInfo: moreMessagesPageInfo,
            scrollPosition: containerRef?.current?.scrollTop,
            isFetched: true,
          },
        },
        variables: { chatId },
      });
    } catch (error) {
      console.error('Error fetching more messages', error);
    }
  };

  const handleScroll = debounce((_: any, ref: RefObject<HTMLDivElement>) => {
    cachedMessagesClient.cache.modify({
      fields: {
        [`cachedMessages({"input":{"chatId":"${chatId}"}})`](
          existingData: any,
        ) {
          return {
            ...existingData,
            scrollPosition: ref?.current?.scrollTop,
          };
        },
      },
    });
  }, 50);

  if (isFetchingMessages) return null;

  return (
    <ChatGroupsStyled
      navbarHeight={navbarHeight}
      appBarHeight={appBarHeight}
      textFieldHeight={textFieldHeight}
    >
      {!messages?.length ? (
        <div className="chat-container">
          <div className="no-messages-wrapper">No Messages</div>
        </div>
      ) : null}
      {messages?.length ? (
        <InfiniteScroll
          className="chat-container"
          loadMore={loadMore}
          hasMore={messagesPageInfo?.hasNextPage}
          onScroll={handleScroll}
          scrollToBottom={scrollToBottom}
          scrollToPosition={scrollToPosition}
          scrollPosition={messagesScrollPosition}
          inverse
        >
          <div className="chat-viewport">
            {messages?.map((item: any, i: number) => {
              const lastItemIndex = messages?.length - 1;
              const prevItem = messages?.[i - 1];
              const nextItem = messages?.[i + 1];

              return (
                <ChatMessage
                  key={item?._id || item?.queueId}
                  index={i}
                  item={item}
                  lastItemIndex={lastItemIndex}
                  prevItem={prevItem}
                  nextItem={nextItem}
                />
              );
            })}
          </div>
        </InfiniteScroll>
      ) : null}
    </ChatGroupsStyled>
  );
};

export default ChatGroups;
