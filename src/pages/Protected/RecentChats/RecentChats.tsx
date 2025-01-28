import { useContext, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatsAndFriendsContext } from '../../../contexts';
import { DataList, MainLayout } from '../components';
import { clickChat } from '../../../helpers';

const RecentChats = ({ loadingRecentChats }: any) => {
  const navigate = useNavigate();
  const {
    chats = [],
    setIsListItemClicked,
    selectedItem,
    setSelectedItem,
    setSelectedDetails,
    isFetchingChats,
    isFetchingOtherFriends,
    isFetchingChats2,
    isFetchingOtherFriends2,
    getChatMessagesWithQueue,
    fetchAll,
  } = useContext(ChatsAndFriendsContext);
  const [currentChats, setCurrentChats] = useState(chats);

  useLayoutEffect(() => {
    if (isFetchingChats2 || isFetchingOtherFriends2 || loadingRecentChats)
      return;
    setCurrentChats(chats);
  }, [chats, isFetchingChats2, isFetchingOtherFriends2, loadingRecentChats]);

  const handleClickChat = async (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: any,
    details: any,
  ) => {
    await clickChat(
      item,
      details,
      getChatMessagesWithQueue,
      setIsListItemClicked,
      setSelectedItem,
      setSelectedDetails,
      navigate,
      fetchAll,
    );
  };

  const loadingChats =
    isFetchingChats || isFetchingOtherFriends || loadingRecentChats;

  return (
    <MainLayout
      heading="Recent Chats"
      defaultText="Nothing to show here..."
      loading={loadingChats}
      data={currentChats}
    >
      <DataList
        disableGutters
        data={currentChats}
        selectedItem={selectedItem}
        handleClickListItem={handleClickChat}
      />
    </MainLayout>
  );
};

export default RecentChats;
