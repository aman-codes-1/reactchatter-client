import { Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Loader, SuspenseWrapper } from '../components';

export const routesConfig = (isLoggedIn: boolean) => [
  {
    key: '1',
    type: 'default',
    path: '/',
    Element: () => (isLoggedIn ? (
      <Navigate replace to="/dashboard" />
    ) : (
      <SuspenseWrapper
        path="pages/Public/Home"
        compName="Home"
        fallback={<Loader center />}
      />
    )),
  },
  {
    key: '2',
    type: 'default',
    path: '*',
    Element: () => <Navigate replace to="/" />,
  },
  {
    key: '3',
    type: 'public',
    path: '/login',
    Element: () => (
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
      >
        <SuspenseWrapper
          path="pages/Public/Login"
          compName="Login"
        />
      </GoogleOAuthProvider>
    ),
  },
  {
    key: '4',
    type: 'private',
    path: '/dashboard/*',
    Element: () => (
      <SuspenseWrapper
        path="pages/Protected/Dashboard"
        compName="Dashboard"
        fallback={<Loader center />}
      />
    ),
  },
];
