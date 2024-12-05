import { Navigate } from 'react-router-dom';
import { SuspenseWrapper } from '../components';
import {
  AddFriend,
  Chats,
  FriendRequests,
  Home,
  RecentChats,
  SentRequests,
} from '../pages';

export const routesConfig = (location: any) => [
  {
    type: 'default',
    path: '*',
    Element: () => <Navigate to="/" replace state={{ from: location }} />,
  },
  {
    type: 'public',
    path: '/',
    Element: () => (
      <SuspenseWrapper path="pages" compName="Home" fallback={<Home />} />
    ),
  },
  {
    type: 'private',
    path: '/',
    Element: () => (
      <SuspenseWrapper
        path="pages"
        compName="RecentChats"
        fallback={<RecentChats />}
      />
    ),
  },
  {
    type: 'private',
    path: '/chat',
    Element: () => (
      <SuspenseWrapper path="pages" compName="Chats" fallback={<Chats />} />
    ),
  },
  {
    type: 'private',
    path: '/addFriend',
    Element: () => (
      <SuspenseWrapper
        path="pages"
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
        path="pages"
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
        path="pages"
        compName="SentRequests"
        fallback={<SentRequests />}
      />
    ),
  },
];
