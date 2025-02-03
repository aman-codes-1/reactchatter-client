import { Suspense, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { DrawerContext, DrawerProvider } from '../../../contexts';
import { DashboardStyled } from './Dashboard.styled';

const Dashboard = () => {
  const { navbarHeight } = useContext(DrawerContext);

  return (
    <DrawerProvider>
      <DashboardStyled navbarHeight={navbarHeight}>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </DashboardStyled>
    </DrawerProvider>
  );
};

export default Dashboard;
