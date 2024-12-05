import { ReactNode, Suspense, useLayoutEffect, useState } from 'react';
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '../hooks';
import { routesConfig } from './config';
import { IRouteConfig } from './IRoutes';
import { BaseProtected } from '../pages';
import { ApolloClientProvider, WebSocketProvider } from '../contexts';

const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultRoutes, setDefaultRoutes] = useState<ReactNode[]>([]);
  const [privateRoutes, setPrivateRoutes] = useState<ReactNode[]>([]);
  const [publicRoutes, setPublicRoutes] = useState<ReactNode[]>([]);
  const { auth } = useAuth();

  useLayoutEffect(() => {
    routesConfig(location).forEach((route: IRouteConfig, index: number) => {
      const { Element, path, type } = route;
      const key = `${index + 1}`;
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

  useLayoutEffect(() => {
    const url = window?.location?.href;
    if (url?.includes('token')) {
      navigate('/', { replace: true });
    }
  }, [window?.location?.href]);

  window.addEventListener('storage', () => {
    window.location.reload();
  });

  return (
    <Routes>
      <Route
        path="/"
        element={
          auth?.isLoggedIn ? (
            <ApolloClientProvider>
              <WebSocketProvider>
                <BaseProtected />
              </WebSocketProvider>
            </ApolloClientProvider>
          ) : (
            <Suspense fallback={null}>
              <Outlet />
            </Suspense>
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
