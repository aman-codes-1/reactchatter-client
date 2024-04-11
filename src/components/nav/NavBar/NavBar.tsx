import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { BaseSvg } from '../../svg/BaseSvg';
import { NavBarStyled } from './NavBar.styled';

const NavBar = ({ className }: any) => (
  <NavBarStyled className={className}>
    <Link to="/" className="nav-logo">
      <BaseSvg id="logo" className="nav-logo-svg" />
    </Link>
    <Button
      className="nav-menu-btn"
      endIcon={<MenuRoundedIcon className="nav-menu-btn-icon" />}
    >
      Menu
    </Button>
  </NavBarStyled>
);

export default NavBar;
