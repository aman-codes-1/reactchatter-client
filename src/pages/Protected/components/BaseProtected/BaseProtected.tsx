import { useContext, useState } from 'react';
import { Drawer, NavBar, SearchBar, SideBar } from '../../../../components';
import { SideBarList } from './components';
import { Dashboard } from './pages';
import { ChatsAndFriendsContext } from '../../../../contexts';
import { BaseProtectedStyled } from './BaseProtected.styled';

const BaseProtected = ({ isLoading }: any) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { chats = [], otherFriends = [] } = useContext(ChatsAndFriendsContext);

  const toggleDrawer = (newOpen: boolean, isSwitch?: boolean) => () => {
    if (isSwitch) {
      setIsDrawerOpen((prev) => !prev);
    } else {
      setIsDrawerOpen(newOpen);
    }
  };

  return (
    <BaseProtectedStyled>
      {chats?.length || otherFriends?.length ? (
        <SearchBar className="mobile-component mobile-search-bar" />
      ) : null}
      <SideBar>
        <SideBarList />
      </SideBar>
      <Dashboard isLoading={isLoading} />
      <Drawer
        isOpen={isDrawerOpen}
        anchor="right"
        onClose={toggleDrawer(false)}
        isMobile
      >
        <SideBarList toggleDrawer={toggleDrawer(false)} />
      </Drawer>
      <NavBar
        className="mobile-component mobile-navbar"
        onMenuClick={toggleDrawer(false, true)}
      />
    </BaseProtectedStyled>
  );
};

export default BaseProtected;
