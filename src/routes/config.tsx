import { Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SuspenseWrapper } from '../components';
import { Home } from '../pages';

export const routesConfig = () => [
  {
    key: '1',
    type: 'default',
    path: '*',
    Element: () => <Navigate replace to="/" />,
  },
  {
    key: '2',
    type: 'public',
    path: '/',
    Element: () => (
      <SuspenseWrapper
        path="pages/Public/Home"
        compName="Home"
        fallback={<Home />}
      />
    ),
  },
  {
    key: '3',
    type: 'public',
    path: '/login',
    Element: () => (
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
      >
        <SuspenseWrapper path="pages/Public/Login" compName="Login" />
      </GoogleOAuthProvider>
    ),
  },
  {
    key: '4',
    type: 'private',
    path: '/',
    Element: () => (
      <SuspenseWrapper
        path="pages/Protected/RecentChats"
        compName="RecentChats"
      />
    ),
  },
  {
    key: '5',
    type: 'private',
    path: '/chat',
    Element: () => (
      <SuspenseWrapper
        path="pages/Protected/ChatMessages"
        compName="ChatMessages"
      />
    ),
  },
  {
    key: '6',
    type: 'private',
    path: '/addFriend',
    Element: () => (
      <SuspenseWrapper path="pages/Protected/AddFriend" compName="AddFriend" />
    ),
  },
  {
    key: '7',
    type: 'private',
    path: '/friendRequests',
    Element: () => (
      <SuspenseWrapper
        path="pages/Protected/FriendRequests"
        compName="FriendRequests"
      />
    ),
  },
  {
    key: '8',
    type: 'private',
    path: '/sentRequests',
    Element: () => (
      <SuspenseWrapper
        path="pages/Protected/SentRequests"
        compName="SentRequests"
      />
    ),
  },
];
