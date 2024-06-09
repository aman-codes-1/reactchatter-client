import { useState } from 'react';
import { Drawer, NavBar, SideBar } from '../../../../components';
import { SideBarList } from './components';
import { Dashboard } from './pages';
import { BaseProtectedStyled } from './BaseProtected.styled';

const BaseProtected = ({ isLoading }: any) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean, isSwitch?: boolean) => () => {
    if (isSwitch) {
      setIsDrawerOpen((prev) => !prev);
    } else {
      setIsDrawerOpen(newOpen);
    }
  };

  return (
    <BaseProtectedStyled>
      <SideBar className="hidden-from-mobile">
        <SideBarList />
      </SideBar>
      <Drawer
        isOpen={isDrawerOpen}
        anchor="right"
        onClose={toggleDrawer(false)}
        isMobile
      >
        <SideBar className="mobile-sidebar">
          <SideBarList toggleDrawer={toggleDrawer(false)} />
        </SideBar>
      </Drawer>
      <Dashboard isLoading={isLoading} />
      <NavBar
        className="hidden-from-web mobile-navbar"
        onMenuClick={toggleDrawer(false, true)}
        toggleDrawer={toggleDrawer(false)}
      />
    </BaseProtectedStyled>
  );
};

export default BaseProtected;
