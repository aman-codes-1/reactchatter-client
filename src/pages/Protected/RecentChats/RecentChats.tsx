import { useContext, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatsAndFriendsContext } from '../../../contexts';
import { DataList, MainLayout } from '../components';
import { clickChat } from '../../../helpers';

const RecentChats = () => {
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
    if (isFetchingChats2 || isFetchingOtherFriends2) return;
    if (chats?.length) {
      setCurrentChats(chats);
    } else {
      setCurrentChats([]);
    }
  }, [chats, isFetchingChats2, isFetchingOtherFriends2]);

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

  const loadingChats = isFetchingChats || isFetchingOtherFriends;

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
