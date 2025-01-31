import { RefObject, useContext, useLayoutEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { InfiniteScroll } from '../../../components';
import {
  CACHED_MESSAGES_QUERY,
  ChatsAndFriendsContext,
} from '../../../contexts';
import ChatMessage from './ChatMessage';
import { ChatGroupsStyled } from './Chats.styled';
import { debounce, sortByTimestamp } from '../../../helpers';

const ChatGroups = ({ appBarHeight, textFieldHeight }: any) => {
  const [navbarHeight] = useOutletContext<any>();
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
    messagesLoading,
    fetchMoreMessages,
    loadingQueued,
    setLoadingQueued,
    scrollToBottom,
    scrollToPosition,
    isRefetchingMessages,
    getQueuedMessages,
    getChatMessagesWithQueue,
  } = useContext(ChatsAndFriendsContext);

  useLayoutEffect(() => {
    const fetchQueuedMessages = async () => {
      if (fullFriendId) {
        setLoadingQueued(true);
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
      const newEdges = [...moreMessagesEdges, messages?.[0]];

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

      const edges = [...moreMessagesEdges, ...messages];

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

  if ((messagesLoading && !isRefetchingMessages) || loadingQueued) return null;

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
