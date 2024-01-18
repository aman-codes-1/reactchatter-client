import { NavBar, SideBar } from '../../../../../components';
import { FriendsProvider } from '../../../../../contexts';
import { BaseDashboardStyled } from './BaseDashboard.styled';

const BaseDashboard = ({ children }: any) => (
  <FriendsProvider>
    <BaseDashboardStyled>
      <SideBar />
      <NavBar className="navbar" />
      {children}
    </BaseDashboardStyled>
  </FriendsProvider>
);

export default BaseDashboard;
