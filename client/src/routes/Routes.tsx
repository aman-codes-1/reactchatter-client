import {
  ReactNode, Suspense, useEffect, useState,
} from 'react';
import { Route, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';
import { Loader, ScrollToTop } from '../components';
import { PrivateRoute, PublicRoute } from '.';
import { routesConfig } from './config';
import { IRouteConfig } from './IRoutes';

const Routes = () => {
  const location = useLocation();
  const { pathname } = location || {};
  const { auth: { isLoggedIn = false } = {} } = useAuth();
  const [defaultRoutes, setDefaultRoutes] = useState<ReactNode[]>([]);
  const [privateRoutes, setPrivateRoutes] = useState<ReactNode[]>([]);
  const [publicRoutes, setPublicRoutes] = useState<ReactNode[]>([]);

  useEffect(() => {
    routesConfig(isLoggedIn).forEach((route: IRouteConfig) => {
      const {
        type, path, visibility, Element, key,
      } = route;
      if (type === 'private' && visibility) {
        setPrivateRoutes((prev: ReactNode[]) => [
          ...prev,
          <Route key={key} path={path} element={<Element />} />,
        ]);
      } else if (type === 'public' && visibility) {
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
  }, [isLoggedIn]);

  return (
    <ScrollToTop pathname={pathname}>
      <Suspense fallback={<Loader center />}>
        {isLoggedIn ? (
          <PrivateRoute privateRoutes={privateRoutes} defaultRoutes={defaultRoutes} />
        ) : (
          <PublicRoute publicRoutes={publicRoutes} defaultRoutes={defaultRoutes} />
        )}
      </Suspense>
    </ScrollToTop>
  );
};

export default Routes;
