import {
  Navigate, Outlet, Route, Routes,
} from 'react-router-dom';
import { SuspenseWrapper } from '../../../components';
import { BaseDashboard } from './components';
import { DashboardStyled } from './Dashboard.styled';

const Dashboard = () => (
  <BaseDashboard>
    <DashboardStyled>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route path="*" element={<Navigate to="/" />} />
          <Route
            path="/"
            element={(
              <SuspenseWrapper
                path="pages/Protected/Dashboard/pages/RecentChats"
                compName="RecentChats"
              />
            )}
          />
          <Route
            path="/add"
            element={(
              <SuspenseWrapper
                path="pages/Protected/Dashboard/pages/AddFriend"
                compName="AddFriend"
              />
            )}
          />
          <Route
            path="/requests"
            element={(
              <SuspenseWrapper
                path="pages/Protected/Dashboard/pages/FriendRequests"
                compName="FriendRequests"
              />
            )}
          />
          <Route
            path="/sent"
            element={(
              <SuspenseWrapper
                path="pages/Protected/Dashboard/pages/SentRequests"
                compName="SentRequests"
              />
            )}
          />
          {/* <Route path="/chats:chatId" element={<>Chats</>} /> */}
        </Route>
      </Routes>
    </DashboardStyled>
  </BaseDashboard>
);

export default Dashboard;
