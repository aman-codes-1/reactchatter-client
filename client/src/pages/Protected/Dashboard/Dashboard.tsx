import { Suspense } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Loader, SuspenseWrapper } from '../../../components';
import { BaseDashboard } from './components';
import { DashboardStyled } from './Dashboard.styled';
import { ChatMessages } from './pages';

const Dashboard = () => {
  const { pathname } = useLocation();

  return (
    <BaseDashboard>
      <DashboardStyled disablePadding={pathname?.includes?.('chats')}>
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route path="*" element={<Navigate to="/" />} />
            <Route
              path="/"
              element={
                <SuspenseWrapper
                  path="pages/Protected/Dashboard/pages/RecentChats"
                  compName="RecentChats"
                />
              }
            />
            <Route
              path="/add"
              element={
                <SuspenseWrapper
                  path="pages/Protected/Dashboard/pages/AddFriend"
                  compName="AddFriend"
                />
              }
            />
            <Route
              path="/requests"
              element={
                <SuspenseWrapper
                  path="pages/Protected/Dashboard/pages/FriendRequests"
                  compName="FriendRequests"
                />
              }
            />
            <Route
              path="/sent"
              element={
                <SuspenseWrapper
                  path="pages/Protected/Dashboard/pages/SentRequests"
                  compName="SentRequests"
                />
              }
            />
            <Route
              path="/chats"
              element={
                <Suspense fallback={null}>
                  <ChatMessages />
                </Suspense>
              }
            >
              <Route
                path=":id"
                element={
                  <Suspense fallback={null}>
                    <ChatMessages />
                  </Suspense>
                }
              />
            </Route>
          </Route>
        </Routes>
      </DashboardStyled>
    </BaseDashboard>
  );
};

export default Dashboard;
