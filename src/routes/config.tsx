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
      <SuspenseWrapper
        path="pages/Public/Login"
        compName="Login"
        fallback={<Login />}
      />
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
        fallback={<RecentChats />}
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
        fallback={<ChatMessages />}
      />
    ),
  },
  {
    key: '6',
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
    key: '7',
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
    key: '8',
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
