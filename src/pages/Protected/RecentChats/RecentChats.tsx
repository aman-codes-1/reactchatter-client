import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '..';
import { ChatsAndFriendsContext } from '../../../contexts';
import { DataList } from '../../../components';
import { RecentChatsStyled } from './RecentChats.styled';

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
      <RecentChatsStyled>
        {chats?.length ? (
          <DataList
            data={chats}
            sliceDataBy={3}
            selectedItem={selectedChat}
            handleClickListItem={handleClickChat}
            className="recent-chats-wrapper"
            ellipsesLineClamp="2"
          />
        ) : null}
      </RecentChatsStyled>
    </MainLayout>
  );
};

export default RecentChats;
