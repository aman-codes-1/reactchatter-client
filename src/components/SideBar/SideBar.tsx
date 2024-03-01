import { MouseEvent, useContext, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { SideBarFooter } from './components';
import { ListItem, NavBar, UserProfile } from '..';
import { FriendsContext } from '../../contexts';
import { useAuth } from '../../hooks';
import { SideBarStyled } from './SideBar.styled';

const SideBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [toggleChats, setToggleChats] = useState(true);
  const selectedParam = pathname?.split?.('/')?.[2];
  const { state: { data = [] } = {} } = useContext(FriendsContext);
  const { auth: { _id = '' } = {} } = useAuth();
  const params = useParams();
  const idArr = params?.['*']?.split?.('--');
  const friendId = idArr?.filter((id) => !id.includes(_id))?.toString();

  const navLinks = [
    {
      icon: <PersonAddAltOutlinedIcon className="list-item-icon" />,
      title: 'Add Friend',
      link: '/dashboard/add',
    },
    {
      icon: <PersonOutlineOutlinedIcon className="list-item-icon" />,
      title: 'Friend Requests',
      link: '/dashboard/requests',
    },
    {
      icon: <PeopleAltOutlinedIcon className="list-item-icon" />,
      title: 'Sent Requests',
      link: '/dashboard/sent',
    },
  ];

  const handleClickListItem = (_: MouseEvent, link: string) => {
    navigate(link);
  };

  const handleClickChat = async (_: MouseEvent, friend: any) => {
    navigate(`/dashboard/chats/${friend?._id}`);
  };

  return (
    <SideBarStyled>
      <div className="sidebar-wrapper">
        <div className="sidebar-menu-wrapper">
          <NavBar />
          {data?.length ? (
            <div className="your-chats-menu-wrapper">
              <ListItem
                dense
                btnSx={{ p: 0 }}
                onClick={() => setToggleChats((prev) => !prev)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Typography
                    className="sidebar-heading"
                    fontFamily="unset"
                    fontWeight={700}
                  >
                    Your chats
                  </Typography>
                  {toggleChats ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownCircleIcon />
                  )}
                </div>
              </ListItem>
              <div className="your-chats-chat-wrapper">
                {toggleChats &&
                  data.map((friend: any, idx: number) => (
                    <UserProfile
                      picture={friend?.friendDetails?.picture}
                      name={friend?.friendDetails?.name}
                      email={friend?.friendDetails?.email}
                      padding="0.15rem 0px"
                      avatarWidth={30}
                      avatarHeight={30}
                      dense
                      onClick={(_) => handleClickChat(_, friend)}
                      selected={
                        idx ===
                        data.findIndex((el: any) => friendId?.includes(el?._id))
                      }
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
                      idx ===
                      navLinks.findIndex(
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
