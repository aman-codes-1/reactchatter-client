import { Navigate } from 'react-router-dom';
import { SuspenseWrapper } from '../components';
import {
  AddFriend,
  ChatMessages,
  FriendRequests,
  Home,
  Login,
  RecentChats,
  SentRequests,
} from '../pages';

export const routesConfig = () => [
  {
    type: 'default',
    path: '*',
    Element: () => <Navigate replace to="/" />,
  },
  {
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
    type: 'public',
    path: '/login',
    Element: () => (
      <SuspenseWrapper
        path="pages/Public/Login"
        compName="Login"
        fallback={<Login />}
      />
    ),
  },
  {
    type: 'private',
    path: '/',
    Element: () => (
      <SuspenseWrapper
        path="pages/Protected/RecentChats"
        compName="RecentChats"
        fallback={<RecentChats />}
      />
    ),
  },
  {
    type: 'private',
    path: '/chat',
    Element: () => (
      <SuspenseWrapper
        path="pages/Protected/ChatMessages"
        compName="ChatMessages"
        fallback={<ChatMessages />}
      />
    ),
  },
  {
    type: 'private',
    path: '/addFriend',
    Element: () => (
      <SuspenseWrapper
        path="pages/Protected/AddFriend"
        compName="AddFriend"
        fallback={<AddFriend />}
      />
    ),
  },
  {
    type: 'private',
    path: '/friendRequests',
    Element: () => (
      <SuspenseWrapper
        path="pages/Protected/FriendRequests"
        compName="FriendRequests"
        fallback={<FriendRequests />}
      />
    ),
  },
  {
    type: 'private',
    path: '/sentRequests',
    Element: () => (
      <SuspenseWrapper
        path="pages/Protected/SentRequests"
        compName="SentRequests"
        fallback={<SentRequests />}
      />
    ),
  },
];
