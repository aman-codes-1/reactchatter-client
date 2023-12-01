import { NavBar, SideBar } from '../../../../../components';
import { BaseDashboardStyled } from './BaseDashboard.styled';

const BaseDashboard = ({ children }: any) => (
  <BaseDashboardStyled>
    <SideBar />
    <NavBar className="navbar" />
    {children}
  </BaseDashboardStyled>
);

export default BaseDashboard;
