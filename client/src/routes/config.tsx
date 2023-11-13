import { Navigate } from 'react-router-dom';
import { SuspenseWrapper } from '../components';

export const routesConfig = (isLoggedIn: boolean) => [
  {
    key: '1',
    type: 'default',
    path: '/',
    visibility: true,
    Element: () => (isLoggedIn ? (
      <Navigate replace to="/dashboard" />
    ) : (
      <SuspenseWrapper path="pages/Public/Home" compName="Home" />
    )),
  },
  {
    key: '2',
    type: 'default',
    path: '*',
    visibility: true,
    Element: () => <Navigate replace to="/" />,
  },
  {
    key: '3',
    type: 'public',
    path: '/login',
    visibility: true,
    Element: () => (
      <SuspenseWrapper path="pages/Public/Login" compName="Login" />
    ),
  },
  {
    key: '4',
    type: 'private',
    path: '/dashboard',
    visibility: true,
    Element: () => (
      <SuspenseWrapper path="pages/Protected/Dashboard" compName="Dashboard" />
    ),
  },
];
