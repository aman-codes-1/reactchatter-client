import { NavBar, SideBar } from '../../../../../components';
import { FriendsProvider } from '../../../../../contexts';
import { BaseDashboardStyled } from './BaseDashboard.styled';

const BaseDashboard = ({ children }: any) => (
  <BaseDashboardStyled>
    <FriendsProvider>
      <SideBar />
      <NavBar className="navbar" />
      {children}
    </FriendsProvider>
  </BaseDashboardStyled>
);

export default BaseDashboard;
