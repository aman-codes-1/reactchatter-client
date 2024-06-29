import { forwardRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { BaseSvg } from '../../svg/BaseSvg';
import { useAuth, useSocket } from '../../../hooks';
import { ChatsAndFriendsContext } from '../../../contexts';
import { NavBarStyled } from './NavBar.styled';

const NavBar = forwardRef(
  ({ onMenuClick, toggleDrawer, className }: any, ref: any) => {
    const { setAuth, setIsLoading } = useAuth();
    const { chats = [], otherFriends = [] } = useContext(
      ChatsAndFriendsContext,
    );
    const { setIsLoading: setIsSocketLoading } = useSocket();

    return (
      <NavBarStyled className={className} ref={ref}>
        <Link
          to="/"
          className="nav-logo"
          onClick={() => {
            toggleDrawer?.();
            setIsLoading(true);
            setAuth(undefined);
            setIsSocketLoading(true);
          }}
        >
          <BaseSvg id="logo" className="nav-logo-svg" />
        </Link>
        {chats?.length || otherFriends?.length ? (
          <Button
            startIcon={<CommentOutlinedIcon />}
            className="nav-new-chat-btn"
            variant="outlined"
            color="info"
            onClick={() => toggleDrawer?.()}
          >
            <div className="text-hidden">New Chat</div>
          </Button>
        ) : null}
        <Button
          className="nav-menu-btn"
          endIcon={<MenuRoundedIcon />}
          onClick={onMenuClick}
        >
          <div className="text-hidden">Menu</div>
        </Button>
      </NavBarStyled>
    );
  },
);

NavBar.displayName = 'NavBar';

export default NavBar;
