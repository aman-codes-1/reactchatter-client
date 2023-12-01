import { ReactNode, useEffect, useState } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';
import { ScrollToTop } from '../components';
import { routesConfig } from './config';
import { IRouteConfig } from './IRoutes';
import { AppRoute } from '.';

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
        Element, key, path, type,
      } = route;
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
  }, [isLoggedIn]);

  return (
    <ScrollToTop pathname={pathname}>
      <AppRoute
        defaultRoutes={defaultRoutes}
        routes={isLoggedIn ? privateRoutes : publicRoutes}
      />
    </ScrollToTop>
  );
};

export default Routes;
