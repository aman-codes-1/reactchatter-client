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
        <Icon
          sx={{
            color: '#9CA3AF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
          }}
        >
          <PersonAddAltOutlinedIcon fontSize="small" />
        </Icon>
      ),
      title: 'Add Friend',
      link: '/dashboard/add',
    },
    {
      icon: (
        <Icon
          sx={{
            color: '#9CA3AF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
          }}
        >
          <PersonOutlineOutlinedIcon fontSize="small" />
        </Icon>
      ),
      title: 'Friend Requests',
      link: '/dashboard/requests',
    },
    {
      icon: (
        <Icon
          sx={{
            color: '#9CA3AF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
          }}
        >
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
            <div style={{ width: '100%' }}>
              <Typography
                component="div"
                className="sidebar-heading"
                fontFamily="unset"
                fontWeight={700}
                onClick={() => setToggleChats((prev) => !prev)}
              >
                Your chats
              </Typography>
              <div style={{ width: '100%', paddingTop: '1.4rem' }}>
                {toggleChats
                  && chats.map((chat) => (
                    <UserProfile
                      picture={chat?.picture}
                      name={chat?.name}
                      padding="0.2rem 0px"
                      avatarWidth={30}
                      avatarHeight={30}
                      dense
                    />
                  ))}
              </div>
            </div>
          ) : null}
          {navLinks?.length ? (
            <div style={{ width: '100%', paddingTop: '0.5rem' }}>
              <Typography
                className="sidebar-heading"
                fontFamily="unset"
                fontWeight={700}
              >
                Overview
              </Typography>
              <div style={{ width: '100%', paddingTop: '0.5rem' }}>
                {navLinks.map((navLink, idx) => (
                  <ListItem
                    key={navLink?.title}
                    listItemIcon={navLink?.icon}
                    primaryText={navLink?.title}
                    padding="0.2rem 0px"
                    dense
                    selected={idx === navLinks.findIndex((el) => selectedParam === el?.link?.split?.('/')?.[2])}
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
