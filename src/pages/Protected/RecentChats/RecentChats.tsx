import { useContext, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataList, MainLayout } from '../../../components';
import { ChatsAndFriendsContext, DrawerContext } from '../../../contexts';
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
    getChatMessagesWithQueue,
    fetchAll,
  } = useContext(ChatsAndFriendsContext);
  const { toggleDrawer } = useContext(DrawerContext);
  const [currentChats, setCurrentChats] = useState(chats);
  const prevPathname = `${location?.pathname}${location?.search}`;

  useLayoutEffect(() => {
    if (isFetchingChats || isFetchingOtherFriends || loadingRecentChats) return;
    setCurrentChats(chats);
  }, [chats, isFetchingChats, isFetchingOtherFriends, loadingRecentChats]);

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
      prevPathname,
      fetchAll,
      toggleDrawer,
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
