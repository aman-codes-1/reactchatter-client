import { useContext, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
  DataList,
  ListItem,
  ListItemButton,
} from '../../../../../../components';
import {
  CHAT_ADDED_SUBSCRIPTION,
  ChatsAndFriendsContext,
  OTHER_FRIENDS_QUERY,
} from '../../../../../../contexts';
import { useAuth } from '../../../../../../hooks';
import { SideBarListStyled } from './SideBarList.styled';

const SideBarList = ({ toggleDrawer, className }: any) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const selectedOverviewLink = pathname?.split?.('/')?.[1];
  const { auth: { _id = '' } = {} } = useAuth();
  const {
    chats = [],
    otherFriends = [],
    pendingRequestsCount = 0,
    sentRequestsCount = 0,
    otherFriendsClient,
    subscribeChatsToMore,
    selectedChat,
    setSelectedChat,
    selectedFriend,
    setSelectedFriend,
    setActiveMember,
  } = useContext(ChatsAndFriendsContext);
  const [toggleChats, setToggleChats] = useState(!!chats?.length);
  const [toggleFriends, setToggleFriends] = useState(!!otherFriends?.length);
  const [isListItemClicked, setIsListItemClicked] = useState(false);

  const navLinks = [
    {
      icon: <PersonAddAltOutlinedIcon className="list-item-icon" />,
      title: 'Add Friend',
      link: '/addFriend',
    },
    {
      icon: <PersonOutlineOutlinedIcon className="list-item-icon" />,
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

  useLayoutEffect(() => {
    const chatsUnsubscribe: any = subscribeChatsToMore?.({
      document: CHAT_ADDED_SUBSCRIPTION,
      updateQuery: (prev: any, { subscriptionData }: any) => {
        if (Object.values(prev || {})?.length) {
          if (!subscriptionData?.data) {
            return prev;
          }
          const OnChatAdded = subscriptionData?.data?.OnChatAdded;
          const OnChatAddedFriendId = OnChatAdded?.friendId;
          const OnChatAddedChat = OnChatAdded?.chat;
          const OnChatAddedMembers = OnChatAddedChat?.members;
          if (
            prev?.chats &&
            prev?.chats?.length &&
            prev?.chats?.find((chat: any) => chat === OnChatAddedChat)
          ) {
            return prev;
          }
          if (
            OnChatAddedMembers?.length &&
            OnChatAddedMembers?.some(
              (OnChatAddedMember: any) => OnChatAddedMember?._id === _id,
            )
          ) {
            if (OnChatAddedChat?.type === 'private') {
              otherFriendsClient.writeQuery({
                query: OTHER_FRIENDS_QUERY,
                data: {
                  otherFriends: otherFriends?.length
                    ? otherFriends?.filter(
                        (otherFriend: any) =>
                          otherFriend?._id !== OnChatAddedFriendId,
                      )
                    : otherFriends,
                },
                variables: {
                  userId: _id,
                },
              });
            }
            return { ...prev, chats: [OnChatAddedChat, ...prev.chats] };
          }
        }
        return prev;
      },
    });

    return () => {
      chatsUnsubscribe?.();
    };
  }, [_id, otherFriends, otherFriendsClient, subscribeChatsToMore]);

  const handleClickOverviewItem = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    link: string,
  ) => {
    toggleDrawer?.();
    navigate(link);
  };

  const handleToggle = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    setToggle: any,
  ) => {
    e?.preventDefault();
    e?.stopPropagation();
    setToggle((prev: boolean) => !prev);
  };

  const handleClickChat = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chat: any,
  ) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsListItemClicked((prev) => !prev);
    toggleDrawer?.();
    if (chat?._id) {
      setSelectedFriend(undefined);
      setActiveMember(undefined);
      setSelectedChat(chat);
      navigate(`/chat?id=${chat?._id}`, { state: { isListItemClicked } });
    }
  };

  const handleClickFriend = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    friend: any,
    activeMember: any,
  ) => {
    e?.preventDefault();
    e?.stopPropagation();
    toggleDrawer?.();
    setIsListItemClicked((prev) => !prev);
    if (friend?._id) {
      setSelectedChat(undefined);
      setSelectedFriend(friend);
      setActiveMember(activeMember);
      navigate('/chat', { state: { isListItemClicked } });
    }
  };

  return (
    <SideBarListStyled
      toggleChats={toggleChats}
      toggleFriends={toggleFriends}
      className={`${className} flex-item`}
    >
      {chats?.length ? (
        <>
          <ListItem
            denseListItem
            disablePadding
            primaryText={{
              title: 'Chats',
              className: 'default-heading heading',
              ellipsesLineClamp: '1',
            }}
            endIcon={
              toggleChats ? <ExpandLessIcon /> : <ExpandCircleDownIcon />
            }
            onClick={(_) => handleToggle(_, setToggleChats)}
          />
          {toggleChats ? (
            <DataList
              data={chats}
              selectedItem={selectedChat}
              handleClickListItem={handleClickChat}
              className="chats-wrapper"
              scrollDependencies={[toggleChats, toggleFriends]}
              ellipsesLineClamp="2"
              btnHeight="5.1rem"
            />
          ) : null}
        </>
      ) : null}
      {otherFriends?.length ? (
        <>
          <ListItem
            denseListItem
            disablePadding
            className={toggleChats && chats?.length ? 'margin-top' : ''}
            primaryText={{
              title: chats?.length ? 'New Chat' : 'Your Friends',
              className: 'default-heading',
              ellipsesLineClamp: '1',
            }}
            endIcon={
              toggleFriends ? (
                <ExpandLessIcon fontSize="small" />
              ) : (
                <ExpandCircleDownIcon fontSize="small" />
              )
            }
            onClick={(_) => handleToggle(_, setToggleFriends)}
          />
          {toggleFriends ? (
            <>
              <DataList
                data={otherFriends}
                sliceDataBy={
                  toggleChats && chats?.length > 2 && otherFriends?.length > 2
                    ? 2
                    : undefined
                }
                selectedItem={selectedFriend}
                handleClickListItem={handleClickFriend}
                className="friends-wrapper"
                scrollDependencies={[toggleChats, toggleFriends]}
                ellipsesLineClamp="1"
              />
              {toggleChats && chats?.length > 2 && otherFriends?.length > 2 ? (
                <ListItemButton
                  denseListItemButton
                  primaryText={{
                    title: 'View More',
                    fontSize: '0.825rem',
                    fontWeight: 501,
                  }}
                  variant="outlined"
                  sx={{ height: '2rem', textAlign: 'center' }}
                />
              ) : null}
            </>
          ) : null}
        </>
      ) : null}
      {navLinks?.length ? (
        <>
          <ListItem
            denseListItem
            disablePadding
            disableHover
            className={
              (toggleChats && !otherFriends?.length) ||
              (!toggleChats && toggleFriends) ||
              (toggleChats && toggleFriends)
                ? 'margin-top'
                : ''
            }
            primaryText={{
              title: 'Overview',
              className: 'default-heading',
              ellipsesLineClamp: '1',
            }}
          />
          <div className="overview-wrapper">
            {navLinks.map((navLink, idx) => (
              <ListItem
                disablePadding
                denseListItem
                sx={{ mb: '0.5rem' }}
                key={navLink?.title}
                startIcon={navLink?.icon}
                primaryText={{
                  title: navLink?.title || '',
                  ellipsesLineClamp: '1',
                }}
                endIcon={
                  <Badge
                    badgeContent={navLink?.count}
                    color="secondary"
                    overlap="circular"
                    sx={{ mr: '0.5rem' }}
                  />
                }
                selected={
                  idx ===
                  navLinks.findIndex(
                    (el) =>
                      selectedOverviewLink === el?.link?.split?.('/')?.[1],
                  )
                }
                onClick={(_) => handleClickOverviewItem(_, navLink?.link)}
              />
            ))}
          </div>
        </>
      ) : null}
    </SideBarListStyled>
  );
};

export default SideBarList;
