import { ReactNode, Suspense, useLayoutEffect, useState } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';
import { routesConfig } from './config';
import { IRouteConfig } from './IRoutes';
import { BaseProtected } from '../pages';
import {
  ApolloClientProvider,
  ChatsAndFriendsProvider,
  WebSocketProvider,
} from '../contexts';

const AppRoutes = () => {
  const location = useLocation();
  const [defaultRoutes, setDefaultRoutes] = useState<ReactNode[]>([]);
  const [privateRoutes, setPrivateRoutes] = useState<ReactNode[]>([]);
  const [publicRoutes, setPublicRoutes] = useState<ReactNode[]>([]);
  const { auth } = useAuth();

  useLayoutEffect(() => {
    routesConfig(location).forEach((route: IRouteConfig) => {
      const { Element, path, type } = route;
      const key = `${path}-${type}`;
      const routeElement = (
        <Route key={key} path={path} element={<Element />} />
      );
      if (type === 'private') {
        setPrivateRoutes((prev: ReactNode[]) => [...prev, routeElement]);
      } else if (type === 'public') {
        setPublicRoutes((prev: ReactNode[]) => [...prev, routeElement]);
      } else if (type === 'default') {
        setDefaultRoutes((prev: ReactNode[]) => [...prev, routeElement]);
      }
    });
  }, [location?.pathname]);

  window.addEventListener('storage', () => {
    window.location.reload();
  });

  const renderRoutes = () => {
    if (auth?.isLoggedIn) {
      return privateRoutes;
    }
    return publicRoutes;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          auth?.isLoggedIn ? (
            <Suspense fallback={null}>
              <ApolloClientProvider>
                <WebSocketProvider>
                  <ChatsAndFriendsProvider>
                    <BaseProtected />
                  </ChatsAndFriendsProvider>
                </WebSocketProvider>
              </ApolloClientProvider>
            </Suspense>
          ) : (
            <Suspense fallback={null}>
              <Outlet />
            </Suspense>
          )
        }
      >
        {defaultRoutes}
        {renderRoutes()}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
