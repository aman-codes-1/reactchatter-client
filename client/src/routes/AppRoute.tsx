import { Outlet, Route, Routes } from 'react-router-dom';
import { IAppRoute } from './IRoutes';

const AppRoute = ({ defaultRoutes, routes }: IAppRoute) => {
  window.addEventListener('storage', () => {
    window.location.reload();
  });

  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        {defaultRoutes}
        {routes}
      </Route>
    </Routes>
  );
};

export default AppRoute;
