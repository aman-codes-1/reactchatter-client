import { useContext, useLayoutEffect, useRef, useState } from 'react';
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

const SideBarList = ({ toggleDrawer, className }: any) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const selectedOverviewLink = pathname?.split?.('/')?.[1];
  const {
    chats = [],
    chatsLoading,
    refetchChats,
    otherFriends = [],
    otherFriendsLoading,
    refetchOtherFriends,
    pendingRequestsCount = 0,
    sentRequestsCount = 0,
    setIsListItemClicked,
    selectedItem,
    setSelectedItem,
    setSelectedDetails,
    getQueuedMessages,
    getChatMessagesWithQueue,
  } = useContext(ChatsAndFriendsContext);
  const [toggleChats, setToggleChats] = useState(!!chats?.length);
  const [toggleFriends, setToggleFriends] = useState(!!otherFriends?.length);

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
    if (chats?.length) {
      setToggleChats(true);
    } else {
      setToggleChats(false);
    }
  }, [chats]);

  useLayoutEffect(() => {
    if (otherFriends?.length) {
      setToggleFriends(true);
    } else {
      setToggleFriends(false);
    }
  }, [otherFriends]);

  const handleToggle = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    setToggle: any,
  ) => {
    setToggle((prev: boolean) => !prev);
  };

  const handleClickChat = async (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chat: any,
    details: any,
  ) => {
    setIsListItemClicked((prev: boolean) => !prev);

    if (chat?._id) {
      try {
        await getChatMessagesWithQueue(chat?._id, 'chatId');
        setSelectedItem(chat);
        setSelectedDetails(details);
        navigate(`/chat?id=${chat?._id}&type=chat`);
        toggleDrawer?.();
      } catch (error: any) {
        console.error('Error fetching messages:', error);
      }
    }
  };

  const handleClickFriend = async (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    friend: any,
    details: any,
  ) => {
    setIsListItemClicked((prev: boolean) => !prev);

    if (friend?._id) {
      try {
        if (friend?.hasChats === true) {
          navigate('/');
          refetchChats();
          refetchOtherFriends();
          return;
        }
        await getQueuedMessages(friend?._id, 'friendId');
        setSelectedItem(friend);
        setSelectedDetails(details);
        navigate(`/chat?id=${friend?._id}&type=friend`);
        toggleDrawer?.();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  };

  const handleClickOverviewItem = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    link: string,
  ) => {
    setIsListItemClicked((prev: boolean) => !prev);
    toggleDrawer?.();
    navigate(link);
  };

  return (
    <SideBarListStyled className={className}>
      {chats?.length ? (
        <>
          <ListItem
            dense
            sx={{ pt: 0 }}
            btnProps={{
              textProps: {
                primary: 'Chats',
                primaryTypographyProps: {
                  className: 'default-heading heading',
                  style: {
                    WebkitLineClamp: 1,
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
              data={chats}
              type="chats"
              loading={chatsLoading}
              selectedItem={selectedItem}
              handleClickListItem={handleClickChat}
              className="flex-list-item margin-bottom"
              scrollDependencies={[toggleChats, toggleFriends]}
            />
          ) : null}
        </>
      ) : null}
      {otherFriends?.length ? (
        <>
          <ListItem
            dense
            sx={!chats?.length ? { pt: 0 } : {}}
            btnProps={{
              textProps: {
                primary: chats?.length ? 'New Chat' : 'Your Friends',
                primaryTypographyProps: {
                  className: 'default-heading',
                  style: {
                    WebkitLineClamp: 1,
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
                data={otherFriends}
                type="otherFriends"
                loading={otherFriendsLoading}
                selectedItem={selectedItem}
                handleClickListItem={handleClickFriend}
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
            sx={!chats?.length && !otherFriends?.length ? { pt: 0 } : {}}
            disableHover
            btnProps={{
              textProps: {
                primary: 'Overview',
                primaryTypographyProps: {
                  className: 'default-heading',
                  style: {
                    WebkitLineClamp: 1,
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
                    primaryTypographyProps: {
                      fontSize: '0.875rem',
                      style: {
                        WebkitLineClamp: 1,
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
