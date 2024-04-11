import { Outlet, Route, Routes } from 'react-router-dom';
import { IAppRoute } from './IRoutes';
import { useAuth } from '../hooks';
import { BaseProtected } from '../pages';

const AppRoute = ({ defaultRoutes, routes }: IAppRoute) => {
  const { auth: { isLoggedIn = false } = {} } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <BaseProtected /> : <Outlet />}>
        {defaultRoutes}
        {routes}
      </Route>
    </Routes>
  );
};

export default AppRoute;
