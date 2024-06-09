import { ReactNode, useLayoutEffect, useState } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';
import { routesConfig } from './config';
import { IRouteConfig } from './IRoutes';
import { BaseProtected } from '../pages';
import { ChatsAndFriendsProvider } from '../contexts';

const AppRoutes = () => {
  const location = useLocation();
  const { pathname } = location || {};
  const { auth, isAuthenticated } = useAuth();
  const [defaultRoutes, setDefaultRoutes] = useState<ReactNode[]>([]);
  const [privateRoutes, setPrivateRoutes] = useState<ReactNode[]>([]);
  const [publicRoutes, setPublicRoutes] = useState<ReactNode[]>([]);

  useLayoutEffect(() => {
    routesConfig().forEach((route: IRouteConfig) => {
      const { Element, key, path, type } = route;
      if (type === 'private') {
        setPrivateRoutes((prev: ReactNode[]) => [
          ...prev,
          <Route key={key} path={path} element={<Element />} />,
        ]);
      } else if (type === 'public') {
        setPublicRoutes((prev: ReactNode[]) => [
          ...prev,
          <Route key={key} path={path} element={<Element />} />,
        ]);
      } else if (type === 'default') {
        setDefaultRoutes((prev: ReactNode[]) => [
          ...prev,
          <Route key={key} path={path} element={<Element />} />,
        ]);
      }
    });
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  window.addEventListener('storage', () => {
    window.location.reload();
  });

  if (!auth && !!isAuthenticated) {
    return <BaseProtected />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          auth?.isLoggedIn ? (
            <ChatsAndFriendsProvider>
              <BaseProtected />
            </ChatsAndFriendsProvider>
          ) : (
            <Outlet />
          )
        }
      >
        {defaultRoutes}
        {auth?.isLoggedIn ? privateRoutes : publicRoutes}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
