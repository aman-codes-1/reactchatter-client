import { useContext } from 'react';
import { Link } from 'react-router-dom';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { BaseSvg, Button } from '../..';
import { ChatsAndFriendsContext } from '../../../contexts';
import { NavBarStyled } from './NavBar.styled';

const NavBar = ({ onMenuClick, toggleDrawer, className }: any) => {
  const {
    chats = [],
    otherFriends = [],
    setIsHomeButtonClicked,
    fetchAll,
  } = useContext(ChatsAndFriendsContext);

  const handleClickLogo = async () => {
    setIsHomeButtonClicked((prev: boolean) => !prev);
    toggleDrawer?.();
    await fetchAll();
  };

  return (
    <NavBarStyled className={className}>
      <Link to="/" className="nav-logo" onClick={handleClickLogo}>
        <BaseSvg id="logo" className="nav-logo-svg" />
      </Link>
      {chats?.length || otherFriends?.length ? (
        <Button
          color="secondary"
          variant="outlined"
          startIcon={<CommentOutlinedIcon />}
          className="text-hidden-xs"
        >
          <div>New Chat</div>
        </Button>
      ) : null}
      <Button
        endIcon={<MenuRoundedIcon />}
        onClick={onMenuClick}
        className="nav-menu-btn text-hidden-xs"
      >
        <div>Menu</div>
      </Button>
    </NavBarStyled>
  );
};

NavBar.displayName = 'NavBar';

export default NavBar;
