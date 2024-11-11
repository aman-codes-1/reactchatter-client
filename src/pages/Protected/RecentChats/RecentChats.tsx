import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatsAndFriendsContext } from '../../../contexts';
import { DataList, MainLayout } from '../components';

const RecentChats = () => {
  const navigate = useNavigate();
  const {
    chats = [],
    chatsLoading,
    setIsListItemClicked,
    selectedItem,
    setSelectedItem,
    setSelectedDetails,
    getChatMessagesWithQueue,
  } = useContext(ChatsAndFriendsContext);

  const handleClickChat = async (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chat: any,
    details: any,
  ) => {
    setIsListItemClicked((prev: boolean) => !prev);

    if (chat?._id) {
      try {
        await getChatMessagesWithQueue(chat?._id, 'chatId');
        setSelectedItem(chat);
        setSelectedDetails(details);
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
      loading={chatsLoading}
      data={chats}
    >
      <DataList
        disableGutters
        data={chats}
        loading={chatsLoading}
        type="chats"
        selectedItem={selectedItem}
        handleClickListItem={handleClickChat}
      />
    </MainLayout>
  );
};

export default RecentChats;
