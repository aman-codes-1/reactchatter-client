import { useContext } from 'react';
import { MainLayout } from '..';
import { ChatsAndFriendsContext } from '../../../contexts';

const RecentChats = () => {
  const {
    chats = [],
    chatsLoading,
    chatsCalled,
  } = useContext(ChatsAndFriendsContext);

  return (
    <MainLayout
      heading="Recent Chats"
      defaultText="Nothing to show here..."
      loading={chatsLoading || !chatsCalled}
      data={chats}
    >
      {chats?.slice(0, 3)?.map((chat: any) => chat?._id)}
    </MainLayout>
  );
};

export default RecentChats;
