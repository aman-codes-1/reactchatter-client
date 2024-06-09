import { useContext, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, Button, Typography } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { DataList, ListItem } from '../../../../../../components';
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
    if (chat?._id) {
      setSelectedFriend(undefined);
      setActiveMember(undefined);
      setSelectedChat(chat);
      navigate(`/chat?id=${chat?._id}`);
    }
  };

  const handleClickFriend = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    friend: any,
    activeMember: any,
  ) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (friend?._id) {
      setSelectedChat(undefined);
      setSelectedFriend(friend);
      setActiveMember(activeMember);
      navigate('/chat');
    }
  };

  return (
    <SideBarListStyled
      chats={chats}
      otherFriends={otherFriends}
      toggleChats={toggleChats}
      toggleFriends={toggleFriends}
      className={`${className} flex-item`}
    >
      <>
        {chats?.length ? (
          <>
            <ListItem
              dense
              btnSx={{ p: 0 }}
              onClick={(_) => handleToggle(_, setToggleChats)}
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
                  className="default-heading heading"
                  fontFamily="unset"
                  fontWeight={800}
                >
                  Chats
                </Typography>
                {toggleChats ? <ExpandLessIcon /> : <ExpandCircleDownIcon />}
              </div>
            </ListItem>
            {toggleChats ? (
              <DataList
                data={chats}
                selectedItem={selectedChat}
                handleClickListItem={handleClickChat}
                className="chats-wrapper"
                scrollDependencies={[toggleChats, toggleFriends]}
                ellipsesLineClamp="2"
              />
            ) : null}
          </>
        ) : null}
        {otherFriends?.length ? (
          <>
            <ListItem
              dense
              btnSx={{
                p: 0,
                mt: toggleChats && chats?.length ? '1.5rem' : '',
              }}
              onClick={(_) => handleToggle(_, setToggleFriends)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  padding: '0.4rem 0rem',
                }}
              >
                <Typography
                  className="default-heading"
                  fontFamily="unset"
                  fontWeight={700}
                >
                  {chats?.length ? 'New Chat' : 'Your Friends'}
                </Typography>
                {toggleFriends ? (
                  <ExpandLessIcon
                    fontSize={chats?.length ? 'small' : 'medium'}
                  />
                ) : (
                  <ExpandCircleDownIcon
                    fontSize={chats?.length ? 'small' : 'medium'}
                  />
                )}
              </div>
            </ListItem>
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
                {toggleChats &&
                chats?.length > 2 &&
                otherFriends?.length > 2 ? (
                  <Button
                    sx={{
                      textTransform: 'none',
                      fontFamily: 'Segoe UI',
                      fontWeight: 600,
                      width: '100%',
                      letterSpacing: '0.02rem',
                    }}
                    variant="outlined"
                    color="info"
                    size="small"
                  >
                    View More
                  </Button>
                ) : null}
              </>
            ) : null}
          </>
        ) : null}
        {navLinks?.length ? (
          <>
            <ListItem
              dense
              btnSx={{
                p: 0,
                mt:
                  (toggleChats && !otherFriends?.length) ||
                  (!toggleChats && toggleFriends) ||
                  (toggleChats && toggleFriends)
                    ? '1.5rem'
                    : '',
              }}
              disableHover
            >
              <div
                style={{
                  width: '100%',
                  padding: '0.4rem 0rem',
                }}
              >
                <Typography
                  className="default-heading"
                  fontFamily="unset"
                  fontWeight={700}
                >
                  Overview
                </Typography>
              </div>
            </ListItem>
            <div className="overview-wrapper">
              {navLinks.map((navLink, idx) => (
                <ListItem
                  key={navLink?.title}
                  listItemIcon={navLink?.icon}
                  primaryText={{
                    title: (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>{navLink?.title}</div>
                        {navLink?.count ? (
                          <div>
                            <Badge
                              badgeContent={navLink?.count}
                              color="secondary"
                            />
                          </div>
                        ) : null}
                      </div>
                    ),
                  }}
                  padding="0.15rem 0px"
                  dense
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
      </>
    </SideBarListStyled>
  );
};

export default SideBarList;
