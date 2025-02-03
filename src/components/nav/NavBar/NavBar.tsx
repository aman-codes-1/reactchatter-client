import { useContext } from 'react';
import { Link } from 'react-router-dom';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { BaseSvg, Button } from '../..';
import { ChatsAndFriendsContext, DrawerContext } from '../../../contexts';
import { NavBarStyled } from './NavBar.styled';

const NavBar = ({ className }: any) => {
  const {
    chats = [],
    otherFriends = [],
    setIsHomeButtonClicked,
    fetchAll,
  } = useContext(ChatsAndFriendsContext);
  const { toggleDrawer } = useContext(DrawerContext);

  const handleClickLogo = async () => {
    setIsHomeButtonClicked((prev: boolean) => !prev);
    toggleDrawer();
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
        onClick={() => toggleDrawer(true)}
        className="nav-menu-btn text-hidden-xs"
      >
        <div>Menu</div>
      </Button>
    </NavBarStyled>
  );
};

NavBar.displayName = 'NavBar';

export default NavBar;
