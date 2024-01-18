import { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FriendsContext } from '../../../../../contexts';
import { useAuth, useChats } from '../../../../../hooks';
import { ChatMessagesStyled } from './ChatMessages.styled';
import ChatRoom from './ChatRoom';

const ChatMessages = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { messageGroups: chatData } = state || {};
  const { auth: { _id = '' } = {} } = useAuth();
  const { state: { data = [] } = {} } = useContext(FriendsContext);
  const ref = useRef<any>(null);
  // const idArr = params?.id?.split?.('--');
  // const myId = idArr?.filter((id) => id === _id)?.toString();
  // const id2 = idArr?.filter((id) => id !== _id)?.toString();
  const id = params?.id;
  const friend = data?.length ? data?.find((el: any) => el?._id === id) : {};
  const friendId = friend?._id || '';
  const friendAvatarSrc = friend?.friendDetails?.picture || '';
  const {
    getChats,
    loadingQuery,
    makeMessageGroups,
    messageGroups,
    setMessageGroups,
  } = useChats(friendId);

  useLayoutEffect(() => {
    setMessageGroups([]);
    if (chatData) {
      setMessageGroups(chatData);
    }
  }, [id]);

  useLayoutEffect(() => {
    if (
      (chatData && chatData?.length) ||
      (messageGroups && messageGroups?.length)
    ) {
      ref?.current?.scrollIntoView({
        behavior: 'instant',
        block: 'end',
      });
    }
  }, [chatData, messageGroups]);

  const fetchChats = async () => {
    await getChats({
      variables: {
        channelId: friendId,
      },
      onCompleted: (res: any) => {
        const messageGroupsData = makeMessageGroups(res?.chats, _id);
        setMessageGroups(messageGroupsData);
      },
    });
  };

  useEffect(() => {
    if (
      window.performance.getEntriesByType('navigation')[0].type === 'reload' ||
      !chatData
    ) {
      fetchChats();
    }
  }, []);

  if (loadingQuery) {
    return null;
  }

  if (!friendId) {
    navigate('/dashboard');
  }

  return (
    <ChatMessagesStyled>
      <ChatRoom
        messageGroups={messageGroups}
        friendAvatarSrc={friendAvatarSrc}
      />
      <div ref={ref} />
    </ChatMessagesStyled>
  );
};

export default ChatMessages;
