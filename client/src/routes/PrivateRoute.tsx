import { Route, Routes } from 'react-router-dom';
import { Base } from '../components';
import { IPrivateRoute } from './IRoutes';

const PrivateRoute = ({ privateRoutes, defaultRoutes }: IPrivateRoute) => (
  <Routes>
    <Route path="/" element={<Base />}>
      {defaultRoutes}
      {privateRoutes}
    </Route>
  </Routes>
);

export default PrivateRoute;
