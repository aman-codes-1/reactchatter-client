import { Route, Routes } from 'react-router-dom';
import { Base } from '../components';
import { IPublicRoute } from './IRoutes';

const PublicRoute = ({ publicRoutes, defaultRoutes }: IPublicRoute) => (
  <Routes>
    <Route path="/" element={<Base />}>
      {defaultRoutes}
      {publicRoutes}
    </Route>
  </Routes>
);

export default PublicRoute;
