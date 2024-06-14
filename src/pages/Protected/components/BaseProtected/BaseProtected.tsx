import { useRef, useState } from 'react';
import { Drawer, NavBar, SideBar } from '../../../../components';
import { SideBarList } from './components';
import { Dashboard } from './pages';
import { BaseProtectedStyled } from './BaseProtected.styled';

const BaseProtected = ({ isAuthLoading }: any) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navbarRef = useRef<any>(null);

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
        overlayHeight={navbarRef?.current?.clientHeight}
      >
        <SideBar className="mobile-sidebar">
          <SideBarList toggleDrawer={toggleDrawer(false)} />
        </SideBar>
      </Drawer>
      <Dashboard isLoading={isAuthLoading} />
      <NavBar
        className="hidden-from-web mobile-navbar"
        onMenuClick={toggleDrawer(false, true)}
        toggleDrawer={toggleDrawer(false)}
        ref={navbarRef}
      />
    </BaseProtectedStyled>
  );
};

export default BaseProtected;
