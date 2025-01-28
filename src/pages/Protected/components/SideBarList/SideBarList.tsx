import { useContext, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, List } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import Face4OutlinedIcon from '@mui/icons-material/Face4Outlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { ChatsAndFriendsContext } from '../../../../contexts';
import { ListItem } from '../../../../components';
import { DataList } from '..';
import { SideBarListStyled } from './SideBarList.styled';
import { clickChat } from '../../../../helpers';

const SideBarList = ({ toggleDrawer, className }: any) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const selectedOverviewLink = pathname?.split?.('/')?.[1];
  const {
    chats = [],
    otherFriends = [],
    pendingRequestsCount = 0,
    sentRequestsCount = 0,
    setIsListItemClicked,
    selectedItem,
    setSelectedItem,
    setSelectedDetails,
    isFetchingChats,
    isFetchingOtherFriends,
    isFetchingChats2,
    isFetchingOtherFriends2,
    getChatMessagesWithQueue,
    fetchAll,
  } = useContext(ChatsAndFriendsContext);
  const [toggleChats, setToggleChats] = useState(!!chats?.length);
  const [toggleFriends, setToggleFriends] = useState(!!otherFriends?.length);
  const [currentChats, setCurrentChats] = useState(chats);
  const [currentOtherFriends, setCurrentOtherFriends] = useState(otherFriends);

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
    if (isFetchingChats2 || isFetchingOtherFriends2) return;
    setCurrentChats(chats);
  }, [chats, isFetchingChats2, isFetchingOtherFriends2]);

  useLayoutEffect(() => {
    setToggleFriends(!!otherFriends?.length);
    if (isFetchingChats2 || isFetchingOtherFriends2) return;
    setCurrentOtherFriends(otherFriends);
  }, [otherFriends, isFetchingChats2, isFetchingOtherFriends2]);

  const handleToggle = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    setToggle: any,
  ) => {
    setToggle((prev: boolean) => !prev);
  };

  const handleClickChat = async (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: any,
    details: any,
  ) => {
    await clickChat(
      item,
      details,
      getChatMessagesWithQueue,
      setIsListItemClicked,
      setSelectedItem,
      setSelectedDetails,
      navigate,
      fetchAll,
      toggleDrawer,
    );
  };

  const handleClickOverviewItem = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    link: string,
  ) => {
    _?.preventDefault();
    setIsListItemClicked((prev: boolean) => !prev);
    toggleDrawer?.();
    navigate(link);
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
              selectedItem={selectedItem}
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
                selectedItem={selectedItem}
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
                key={`${navLink?.title}-${idx}`}
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
