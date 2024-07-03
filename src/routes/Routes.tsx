import { ReactNode, Suspense, lazy, useLayoutEffect, useState } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';
import { routesConfig } from './config';
import { IRouteConfig } from './IRoutes';
// import { BaseProtected } from '../pages';
import { ChatsAndFriendsProvider } from '../contexts';
import { BaseProtected } from '../pages';

const AppRoutes = ({ isLoading }: any) => {
  const location = useLocation();
  const { pathname } = location || {};
  const { auth } = useAuth();
  const [defaultRoutes, setDefaultRoutes] = useState<ReactNode[]>([]);
  const [privateRoutes, setPrivateRoutes] = useState<ReactNode[]>([]);
  const [publicRoutes, setPublicRoutes] = useState<ReactNode[]>([]);

  useLayoutEffect(() => {
    routesConfig().forEach((route: IRouteConfig, index: number) => {
      const { Element, path, type } = route;
      const key = `${index + 1}`;
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

  const Protected = lazy(() =>
    import('../pages').then((module) => ({ default: module.BaseProtected })),
  );

  const renderElement = () => {
    if (isLoading) {
      return (
        <Suspense fallback={<BaseProtected isLoading={isLoading} />}>
          <Protected isLoading={isLoading} />
        </Suspense>
      );
    } else if (!isLoading && auth?.isLoggedIn) {
      return (
        <ChatsAndFriendsProvider>
          <BaseProtected isLoading={isLoading} />
        </ChatsAndFriendsProvider>
      );
    }
    return (
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    );
  };

  return (
    <Routes>
      <Route path="/" element={renderElement()}>
        {defaultRoutes}
        {isLoading || auth?.isLoggedIn ? privateRoutes : publicRoutes}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
