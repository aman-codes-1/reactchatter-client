import { ReactNode, useContext } from 'react';
import { NavBar, SearchBar } from '../..';
import { SideBarFooter } from '..';
import { ChatsAndFriendsContext } from '../../../contexts';
import { SideBarStyled } from './SideBar.styled';

const SideBar = ({ children }: { children: ReactNode }) => {
  const { chats = [], otherFriends = [] } = useContext(ChatsAndFriendsContext);

  return (
    <SideBarStyled>
      <NavBar className="sidebar-navbar flex-item" />
      {chats?.length || otherFriends?.length ? (
        <SearchBar className="sidebar-search flex-item" />
      ) : null}
      {children}
      <SideBarFooter className="sidebar-footer flex-item" />
    </SideBarStyled>
  );
};

export default SideBar;
