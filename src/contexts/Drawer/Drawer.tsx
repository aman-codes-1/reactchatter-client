import { createContext, useLayoutEffect, useRef, useState } from 'react';
import { AppBar } from '@mui/material';
import { Drawer, NavBar, SideBar } from '../../components';
import { updateHeight, updateWidth } from '../../helpers';
import { SideBarList } from './SideBarList';
import { DrawerStyled } from './Drawer.styled';

export const DrawerContext = createContext<any>({});

export const DrawerProvider = ({ children }: any) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [sideBarWidth, setSideBarWidth] = useState(0);
  const navbarRef = useRef<HTMLElement | null>(null);
  const sideBarRef = useRef<HTMLDivElement | null>(null);

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

  const toggleDrawer = (isSwitch?: boolean, value?: boolean) => {
    if (isSwitch) {
      setIsDrawerOpen((prev) => !prev);
    } else {
      setIsDrawerOpen(!!value);
    }
  };

  return (
    <DrawerContext.Provider
      value={{
        isDrawerOpen,
        setIsDrawerOpen,
        sideBarWidth,
        navbarHeight,
        toggleDrawer,
      }}
    >
      <DrawerStyled>
        <SideBar ref={sideBarRef} className="hidden-from-mobile">
          <SideBarList className="flex-item" />
        </SideBar>
        <Drawer
          isOpen={isDrawerOpen}
          anchor="right"
          onClose={() => toggleDrawer()}
          isMobile
          navbarHeight={navbarHeight}
        >
          <SideBar ref={sideBarRef} className="mobile-sidebar">
            <SideBarList className="flex-item" />
          </SideBar>
        </Drawer>
        {children}
        <AppBar
          position="fixed"
          elevation={0}
          className="hidden-from-web mobile-navbar"
          ref={navbarRef}
        >
          <NavBar />
        </AppBar>
      </DrawerStyled>
    </DrawerContext.Provider>
  );
};
