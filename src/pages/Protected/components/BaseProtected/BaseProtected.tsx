import { useLayoutEffect, useRef, useState } from 'react';
import { AppBar } from '@mui/material';
import { Drawer, NavBar, SideBar } from '../../../../components';
import { updateHeight, updateWidth } from '../../../../helpers';
import { Dashboard, SideBarList } from '..';
import { BaseProtectedStyled } from './BaseProtected.styled';

const BaseProtected = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [sideBarWidth, setSideBarWidth] = useState(0);
  const navbarRef = useRef<any>(null);
  const sideBarRef = useRef<any>(null);

  const toggleDrawer = (newOpen: boolean, isSwitch?: boolean) => () => {
    if (isSwitch) {
      setIsDrawerOpen((prev) => !prev);
    } else {
      setIsDrawerOpen(newOpen);
    }
  };

  useLayoutEffect(() => {
    updateHeight(navbarRef, setNavbarHeight);
    window.addEventListener('resize', () =>
      updateHeight(navbarRef, setNavbarHeight),
    );

    return () => {
      window.removeEventListener('resize', () =>
        updateHeight(navbarRef, setNavbarHeight),
      );
    };
  }, []);

  useLayoutEffect(() => {
    updateWidth(sideBarRef, setSideBarWidth);
    window.addEventListener('resize', () =>
      updateWidth(sideBarRef, setSideBarWidth),
    );

    return () => {
      window.removeEventListener('resize', () =>
        updateWidth(sideBarRef, setSideBarWidth),
      );
    };
  }, []);

  return (
    <BaseProtectedStyled>
      <SideBar ref={sideBarRef} className="hidden-from-mobile">
        <SideBarList className="flex-item" />
      </SideBar>
      <Drawer
        isOpen={isDrawerOpen}
        anchor="right"
        onClose={toggleDrawer(false)}
        isMobile
        navbarHeight={navbarHeight}
      >
        <SideBar ref={sideBarRef} className="mobile-sidebar">
          <SideBarList
            className="flex-item"
            toggleDrawer={toggleDrawer(false)}
          />
        </SideBar>
      </Drawer>
      <Dashboard navbarHeight={navbarHeight} sideBarWidth={sideBarWidth} />
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
