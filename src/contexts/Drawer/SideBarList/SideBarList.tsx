import { useContext, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, List } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import Face4OutlinedIcon from '@mui/icons-material/Face4Outlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { DataList, ListItem } from '../../../components';
import { clickChat } from '../../../helpers';
import { ChatsAndFriendsContext, DrawerContext } from '../..';
import { SideBarListStyled } from './SideBarList.styled';

const SideBarList = ({ className }: any) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const selectedOverviewLink = pathname?.split?.('/')?.[1];
  const {
    chats = [],
    otherFriends = [],
    pendingRequestsCount = 0,
    sentRequestsCount = 0,
    setIsListItemClicked,
    selectedChat,
    setSelectedChat,
    setSelectedChatDetails,
    isFetchingChats,
    isFetchingOtherFriends,
    getChatMessagesWithQueue,
    fetchAll,
  } = useContext(ChatsAndFriendsContext);
  const { toggleDrawer } = useContext(DrawerContext);
  const [toggleChats, setToggleChats] = useState(!!chats?.length);
  const [toggleFriends, setToggleFriends] = useState(!!otherFriends?.length);
  const [currentChats, setCurrentChats] = useState(chats);
  const [currentOtherFriends, setCurrentOtherFriends] = useState(otherFriends);
  const prevPathname = `${location?.pathname}${location?.search}`;

  const navLinks = [
    {
      icon: <PersonAddAltOutlinedIcon className="list-item-icon" />,
      title: 'Add Friend',
      link: '/addFriend',
    },
    {
      icon: <Face4OutlinedIcon className="list-item-icon" />,
      title: 'Friend Requests',
      link: '/friendRequests',
      count: pendingRequestsCount,
    },
    {
      icon: <PeopleAltOutlinedIcon className="list-item-icon" />,
      title: 'Sent Requests',
      link: '/sentRequests',
      count: sentRequestsCount,
    },
  ];

  useLayoutEffect(() => {
    setToggleChats(!!chats?.length);
    if (isFetchingChats || isFetchingOtherFriends) return;
    setCurrentChats(chats);
  }, [chats, isFetchingChats, isFetchingOtherFriends]);

  useLayoutEffect(() => {
    setToggleFriends(!!otherFriends?.length);
    if (isFetchingChats || isFetchingOtherFriends) return;
    setCurrentOtherFriends(otherFriends);
  }, [otherFriends, isFetchingChats, isFetchingOtherFriends]);

  const handleToggle = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    setToggle: any,
  ) => {
    setToggle((prev: boolean) => !prev);
  };

  const handleClickChat = async (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: any,
    chatDetails: any,
  ) => {
    await clickChat(
      item,
      chatDetails,
      getChatMessagesWithQueue,
      setIsListItemClicked,
      setSelectedChat,
      setSelectedChatDetails,
      navigate,
      prevPathname,
      fetchAll,
      toggleDrawer,
    );
  };

  const handleClickOverviewItem = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    link: string,
  ) => {
    setIsListItemClicked((prev: boolean) => !prev);
    toggleDrawer();
    if (prevPathname !== link) {
      navigate(link);
    }
  };

  const isLoaded = !isFetchingChats && !isFetchingOtherFriends;
  const showChats = isLoaded && !!currentChats?.length;
  const showOtherFriends = isLoaded && !!currentOtherFriends?.length;
  const bothNotVisible = !showChats && !showOtherFriends;

  return (
    <SideBarListStyled className={className}>
      {showChats ? (
        <>
          <ListItem
            dense
            sx={{ pt: 0 }}
            btnProps={{
              textProps: {
                primary: 'Chats',
                slotProps: {
                  primary: {
                    className: 'default-heading heading',
                    style: {
                      WebkitLineClamp: 1,
                    },
                  },
                },
              },
              endIcon: toggleChats ? (
                <ExpandLessIcon />
              ) : (
                <ExpandCircleDownIcon />
              ),
              onClick: (_) => handleToggle(_, setToggleChats),
            }}
          />
          {toggleChats ? (
            <DataList
              dense
              data={currentChats}
              selectedChat={selectedChat}
              handleClickListItem={handleClickChat}
              className="flex-list-item margin-bottom"
              scrollDependencies={[toggleChats, toggleFriends]}
            />
          ) : null}
        </>
      ) : null}
      {showOtherFriends ? (
        <>
          <ListItem
            dense
            sx={!showChats ? { pt: 0 } : {}}
            btnProps={{
              textProps: {
                primary: currentChats?.length ? 'New Chat' : 'Your Friends',
                slotProps: {
                  primary: {
                    className: 'default-heading',
                    style: {
                      WebkitLineClamp: 1,
                    },
                  },
                },
              },
              endIcon: toggleFriends ? (
                <ExpandLessIcon fontSize="small" />
              ) : (
                <ExpandCircleDownIcon fontSize="small" />
              ),
              onClick: (_) => handleToggle(_, setToggleFriends),
            }}
          />
          {toggleFriends ? (
            <>
              <DataList
                dense
                data={currentOtherFriends}
                selectedChat={selectedChat}
                handleClickListItem={handleClickChat}
                className="flex-list-item margin-bottom"
                scrollDependencies={[toggleChats, toggleFriends]}
              />
            </>
          ) : null}
        </>
      ) : null}
      {navLinks?.length ? (
        <>
          <ListItem
            dense
            sx={bothNotVisible ? { pt: 0 } : {}}
            disableHover
            btnProps={{
              textProps: {
                primary: 'Overview',
                slotProps: {
                  primary: {
                    className: 'default-heading',
                    style: {
                      WebkitLineClamp: 1,
                    },
                  },
                },
              },
            }}
          />
          <List dense disablePadding className="flex-list-item">
            {navLinks.map((navLink, idx) => (
              <ListItem
                key={navLink?.title}
                btnProps={{
                  textProps: {
                    primary: navLink?.title || '',
                    slotProps: {
                      primary: {
                        fontSize: '0.875rem',
                        style: {
                          WebkitLineClamp: 1,
                        },
                      },
                    },
                  },
                  startIcon: navLink?.icon,
                  endIcon: (
                    <Badge
                      badgeContent={navLink?.count}
                      color="secondary"
                      overlap="circular"
                      sx={{ mr: '0.5rem' }}
                    />
                  ),
                  selected:
                    idx ===
                    navLinks.findIndex(
                      (el) =>
                        selectedOverviewLink === el?.link?.split?.('/')?.[1],
                    ),
                  onClick: (_) => handleClickOverviewItem(_, navLink?.link),
                }}
              />
            ))}
          </List>
        </>
      ) : null}
    </SideBarListStyled>
  );
};

export default SideBarList;
