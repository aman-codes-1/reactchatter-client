import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '..';
import { ChatsAndFriendsContext } from '../../../contexts';
import { DataList } from '../../../components';

const RecentChats = () => {
  const navigate = useNavigate();
  const {
    chats = [],
    chatsLoading,
    chatsCalled,
    selectedChat,
    setSelectedChat,
    setSelectedFriend,
    setActiveMember,
  } = useContext(ChatsAndFriendsContext);

  const handleClickChat = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chat: any,
  ) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (chat?._id) {
      setSelectedFriend(undefined);
      setActiveMember(undefined);
      setSelectedChat(chat);
      navigate(`/chat?id=${chat?._id}`);
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
        dense={false}
        dividerVariant="fullWidth"
        data={chats}
        selectedItem={selectedChat}
        handleClickListItem={handleClickChat}
        className="overflow-wrapper"
        WebkitLineClamp={2}
      />
    </MainLayout>
  );
};

export default RecentChats;
