import { Suspense, lazy, useLayoutEffect, useRef, useState } from 'react';
import { AppBar } from '@mui/material';
import { Drawer, Loader, NavBar, SideBar } from '../../../../components';
import { SideBarList } from './components';
import { BaseProtectedStyled } from './BaseProtected.styled';
import { Dashboard } from './pages';

const BaseProtected = ({ isLoading }: any) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef<any>(null);

  const toggleDrawer = (newOpen: boolean, isSwitch?: boolean) => () => {
    if (isSwitch) {
      setIsDrawerOpen((prev) => !prev);
    } else {
      setIsDrawerOpen(newOpen);
    }
  };

  useLayoutEffect(() => {
    setNavbarHeight(navbarRef?.current?.clientHeight);
  }, []);

  // const Dashboard = lazy(() =>
  //   import('./pages').then((module) => ({ default: module.Dashboard })),
  // );

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
        navbarHeight={navbarHeight}
      >
        <SideBar className="mobile-sidebar">
          <SideBarList toggleDrawer={toggleDrawer(false)} />
        </SideBar>
      </Drawer>
      {/* <Suspense fallback={<Loader center />}> */}
      <Dashboard isLoading={isLoading} navbarHeight={navbarHeight} />
      {/* </Suspense> */}
      <AppBar
        position="fixed"
        elevation={0}
        className="hidden-from-web mobile-navbar"
        ref={navbarRef}
      >
        <NavBar
          onMenuClick={toggleDrawer(false, true)}
          toggleDrawer={toggleDrawer(false)}
        />
      </AppBar>
    </BaseProtectedStyled>
  );
};

export default BaseProtected;
