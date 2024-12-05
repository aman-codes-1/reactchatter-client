import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Chip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Avatar } from '../../../components';
import { useAuth } from '../../../hooks';
import {
  ChatsAndFriendsContext,
  MESSAGE_GROUPS_QUERY,
} from '../../../contexts';
import { groupMessages, mergeLastByDateLabel } from '../../../helpers';
import ChatBubble from './ChatBubble';
import { ChatGroupsStyled } from './Chats.styled';

const ChatGroups = ({ appBarHeight, textFieldHeight }: any) => {
  const [navbarHeight] = useOutletContext<any>();
  const [searchParams] = useSearchParams();
  const chatId =
    searchParams.get('type') === 'chat' ? searchParams.get('id') : null;
  const friendId =
    searchParams.get('type') === 'friend' ? searchParams.get('id') : null;
  const [isResize, setIsResize] = useState(false);
  const [prevScrollTop, setPrevScrollTop] = useState(0);
  const { auth: { _id = '' } = {} } = useAuth();
  const {
    messagesLoading,
    fetchMoreMessages,
    messageGroups = [],
    messageGroupsPageInfo,
    messageGroupsQueuedPageInfo,
    messageGroupsScrollPosition,
    messageGroupsClient,
    loadingQueued,
    scrollToBottom,
    scrollToPosition,
    isRefetchingMessages,
    getChatMessagesWithQueue,
  } = useContext(ChatsAndFriendsContext);
  const scrollRef = useRef<any>(null);
  const scrollBottomRef = useRef<any>(null);

  useLayoutEffect(() => {
    const scrollBottom = () => {
      if (scrollBottomRef?.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    requestAnimationFrame(scrollBottom);
  }, [messagesLoading, loadingQueued, scrollToBottom]);

  useLayoutEffect(() => {
    if (scrollRef?.current && messageGroupsScrollPosition >= 0) {
      const scrollPosition = () => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = messageGroupsScrollPosition;
        }
      };
      requestAnimationFrame(scrollPosition);
    }
  }, [scrollToPosition]);

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsResize((prev) => !prev);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchQueuedMessages = async () => {
      if (friendId) {
        await getChatMessagesWithQueue(friendId, 'friendId');
      }
    };

    fetchQueuedMessages();
  }, []);

  if ((messagesLoading && !isRefetchingMessages) || loadingQueued) return null;

  const handleScroll = async () => {
    // to do: implement cursor pagination for queued messages
    if (scrollRef?.current && chatId) {
      const scrollHeightBefore = scrollRef?.current?.scrollHeight;
      const scrollTopBefore = scrollRef?.current?.scrollTop;
      const isScrollingUp = scrollTopBefore < prevScrollTop;
      const minScrollTop = scrollHeightBefore / 2;

      if (
        messageGroups?.length &&
        messageGroupsPageInfo?.hasNextPage &&
        scrollTopBefore < minScrollTop &&
        isScrollingUp
      ) {
        try {
          const moreMessages = await fetchMoreMessages({
            variables: {
              chatId,
              after: messageGroupsPageInfo?.endCursor,
            },
            updateQuery: (prev: any, { fetchMoreResult }: any) => {
              if (!fetchMoreResult) return prev;
              return {
                messages: fetchMoreResult?.messages,
              };
            },
          });

          const newMessagesData = moreMessages?.data?.messages;
          const newMessages = newMessagesData?.edges;
          const newPageInfo = newMessagesData?.pageInfo;

          let edges: any[] = [];

          if (newMessages?.length) {
            const groupedNewMessages = groupMessages(newMessages, _id);
            edges = mergeLastByDateLabel(messageGroups, groupedNewMessages);
          }

          messageGroupsClient.writeQuery({
            query: MESSAGE_GROUPS_QUERY,
            data: {
              messageGroups: {
                edges: edges?.length ? edges : messageGroups,
                pageInfo: newPageInfo,
                queuedPageInfo: messageGroupsQueuedPageInfo,
                scrollPosition: scrollRef?.current?.scrollTop,
              },
            },
            variables: { chatId },
          });

          const observer = new MutationObserver(() => {
            const scrollHeightAfter = scrollRef?.current?.scrollHeight;
            scrollRef.current.scrollTop =
              scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);

            observer.disconnect();
          });

          observer.observe(scrollRef?.current, {
            childList: true,
            subtree: true,
          });
        } catch (error) {
          console.error('Error fetching more messages', error);
        }
      }

      messageGroupsClient.cache.modify({
        fields: {
          [`messageGroups({"input":{"chatId":"${chatId}"}})`](
            existingData: any,
          ) {
            return {
              ...existingData,
              scrollPosition: scrollRef?.current?.scrollTop,
            };
          },
        },
      });

      setPrevScrollTop(scrollTopBefore);
    }
  };

  return (
    <ChatGroupsStyled
      navbarHeight={navbarHeight}
      appBarHeight={appBarHeight}
      textFieldHeight={textFieldHeight}
    >
      <div className="chat-container" ref={scrollRef} onScroll={handleScroll}>
        {!messageGroups?.length ? (
          <div className="no-messages-wrapper">No Messages</div>
        ) : null}
        {messageGroups?.length ? (
          <div className="chat-wrapper">
            <div className="chat-grid">
              {messageGroups?.map((messageGroup: any, index: number) => (
                <div
                  className="chat-group"
                  key={`${messageGroup?.dateLabel}-${index}`}
                >
                  {messageGroup?.dateLabel ? (
                    <div className="date-label-wrapper">
                      <Chip
                        variant="outlined"
                        label={messageGroup?.dateLabel}
                        className="date-label-chip"
                      />
                    </div>
                  ) : null}
                  {messageGroup?.groups?.length
                    ? messageGroup?.groups?.map((group: any, idx: number) => (
                        <div
                          className="chat-group-grid"
                          key={`${group?.data?.[0]?._id}-${idx}`}
                        >
                          <Grid
                            container
                            spacing={2}
                            justifyContent={
                              group?.side === 'right'
                                ? 'flex-end'
                                : 'flex-start'
                            }
                            alignItems="flex-end"
                          >
                            {group?.side === 'left' ? (
                              <Grid>
                                <Avatar
                                  alt={group?.groupDetails?.name}
                                  src={group?.groupDetails?.picture}
                                  sx={{ width: 32, height: 32 }}
                                />
                              </Grid>
                            ) : null}
                            {group?.data?.length ? (
                              <Grid
                                size={9}
                                gap={0.6}
                                display="flex"
                                flexDirection="column"
                                alignItems={
                                  group?.side === 'right'
                                    ? 'flex-end'
                                    : 'flex-start'
                                }
                              >
                                {group?.data?.map((msg: any, i: number) => (
                                  <ChatBubble
                                    msg={msg}
                                    index={i}
                                    data={group?.data}
                                    side={group?.side}
                                    isResize={isResize}
                                    key={`${msg?._id || msg?.queueId}-${i}-${isResize}`}
                                  />
                                ))}
                              </Grid>
                            ) : null}
                          </Grid>
                        </div>
                      ))
                    : null}
                </div>
              ))}
            </div>
            <div ref={scrollBottomRef} />
          </div>
        ) : null}
      </div>
    </ChatGroupsStyled>
  );
};

export default ChatGroups;
