import { MouseEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon, Typography } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { NavBar } from '../NavBar';
import { SideBarFooter } from './components';
import { ListItem, UserProfile } from '..';
import { SideBarStyled } from './SideBar.styled';

const SideBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [toggleChats, setToggleChats] = useState(true);
  const selectedParam = pathname?.split?.('/')?.[2];

  const chats = [
    {
      name: 'Aman Jain',
      picture: '',
    },
    {
      name: 'Shubham',
      picture: '',
    },
  ];

  const navLinks = [
    {
      icon: (
        <Icon className="list-item-icon">
          <PersonAddAltOutlinedIcon fontSize="small" />
        </Icon>
      ),
      title: 'Add Friend',
      link: '/dashboard/add',
    },
    {
      icon: (
        <Icon className="list-item-icon">
          <PersonOutlineOutlinedIcon fontSize="small" />
        </Icon>
      ),
      title: 'Friend Requests',
      link: '/dashboard/requests',
    },
    {
      icon: (
        <Icon className="list-item-icon">
          <PeopleAltOutlinedIcon fontSize="small" />
        </Icon>
      ),
      title: 'Sent Requests',
      link: '/dashboard/sent',
    },
  ];

  const handleClickListItem = (_: MouseEvent, link: string) => {
    navigate(link);
  };

  return (
    <SideBarStyled>
      <div className="sidebar-wrapper">
        <div className="sidebar-menu-wrapper">
          <NavBar />
          {chats?.length ? (
            <div className="your-chats-menu-wrapper">
              <Typography
                component="div"
                className="sidebar-heading"
                fontFamily="unset"
                fontWeight={700}
                onClick={() => setToggleChats((prev) => !prev)}
              >
                Your chats
              </Typography>
              <div className="your-chats-chat-wrapper">
                {toggleChats
                  && chats.map((chat) => (
                    <UserProfile
                      picture={chat?.picture}
                      name={chat?.name}
                      padding="0.15rem 0px"
                      avatarWidth={30}
                      avatarHeight={30}
                      dense
                    />
                  ))}
              </div>
            </div>
          ) : null}
          {navLinks?.length ? (
            <div className="overview-menu-wrapper">
              <Typography
                className="sidebar-heading"
                fontFamily="unset"
                fontWeight={700}
              >
                Overview
              </Typography>
              <div className="overview-nav-link-wrapper">
                {navLinks.map((navLink, idx) => (
                  <ListItem
                    key={navLink?.title}
                    listItemIcon={navLink?.icon}
                    primaryText={navLink?.title}
                    padding="0.15rem 0px"
                    dense
                    selected={
                      idx
                      === navLinks.findIndex(
                        (el) => selectedParam === el?.link?.split?.('/')?.[2],
                      )
                    }
                    onClick={(_) => handleClickListItem(_, navLink?.link)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <SideBarFooter />
      </div>
    </SideBarStyled>
  );
};

export default SideBar;
