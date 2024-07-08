import { forwardRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { BaseSvg, ListItemButton } from '../..';
import { useAuth, useSocket } from '../../../hooks';
import { ChatsAndFriendsContext } from '../../../contexts';
import { NavBarStyled } from './NavBar.styled';

const NavBar = forwardRef(
  ({ onMenuClick, toggleDrawer, className }: any, ref: any) => {
    const { setAuth } = useAuth();
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
            setAuth(undefined);
            setIsSocketLoading(true);
          }}
        >
          <BaseSvg id="logo" className="nav-logo-svg" />
        </Link>
        {chats?.length || otherFriends?.length ? (
          // <Button
          //   startIcon={<CommentOutlinedIcon />}
          //   className="nav-new-chat-btn"
          //   variant="outlined"
          //   color="info"
          //   onClick={() => toggleDrawer?.()}
          // >
          //   <div className="text-hidden">New Chat</div>
          // </Button>
          <ListItemButton
            denseListItemButton
            startIcon={
              <CommentOutlinedIcon
                fontSize="small"
                className="nav-new-chat-btn-icon"
              />
            }
            primaryText={{
              title: (
                <div className="nav-new-chat-btn-title text-hidden">
                  New Chat
                </div>
              ),
              fontWeight: 501,
            }}
            width="auto"
            variant="outlined"
            btnHeight="2.35rem"
            className="nav-new-chat-btn"
          />
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
