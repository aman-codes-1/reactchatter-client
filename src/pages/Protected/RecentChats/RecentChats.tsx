import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '..';
import { ChatsAndFriendsContext, MessagesContext } from '../../../contexts';
import { DataList } from '../../../components';

const RecentChats = () => {
  const navigate = useNavigate();
  const {
    chats = [],
    chatsLoading,
    chatsCalled,
    setIsListItemClicked,
    setLoadingQuery,
    selectedItem,
    setSelectedItem,
    setSelectedMember,
  } = useContext(ChatsAndFriendsContext);
  const { setLoadingChatMessages, getChatMessagesWithQueue } =
    useContext(MessagesContext);

  const handleClickChat = async (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chat: any,
  ) => {
    setIsListItemClicked((prev: boolean) => !prev);

    if (chat?._id) {
      try {
        setLoadingQuery(false);
        setLoadingChatMessages(false);
        await getChatMessagesWithQueue(chat?._id, 'chatId');
        setSelectedItem(chat);
        navigate(`/chat?id=${chat?._id}&type=chat`);
      } catch (error: any) {
        console.error('Error fetching messages:', error);
      }
    }
  };

  return (
    <MainLayout
      heading="Recent Chats"
      defaultText="Nothing to show here..."
      loading={chatsLoading || !chatsCalled}
      data={chats}
    >
      <DataList
        disableGutters
        data={chats}
        selectedItem={selectedItem}
        handleClickListItem={handleClickChat}
        className="overflow-wrapper"
        WebkitLineClamp={2}
      />
    </MainLayout>
  );
};

export default RecentChats;
