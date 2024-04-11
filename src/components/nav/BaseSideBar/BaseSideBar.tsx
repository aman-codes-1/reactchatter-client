import { ReactNode } from 'react';
import { SideBarFooter } from '..';
import { NavBar } from '../..';
import { BaseSideBarStyled } from './BaseSideBar.styled';

const BaseSideBar = ({ children }: { children: ReactNode }) => (
  <BaseSideBarStyled>
    <div className="sidebar-wrapper">
      <div className="sidebar-menu-wrapper">
        <div
          style={{
            padding: '0rem 1.5rem',
          }}
        >
          <NavBar />
          {children}
        </div>
        <SideBarFooter sx={{ marginTop: 'auto' }} />
      </div>
    </div>
  </BaseSideBarStyled>
);

export default BaseSideBar;
