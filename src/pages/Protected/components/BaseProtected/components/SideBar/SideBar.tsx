import { useContext, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Badge, Button, Typography } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ForumIcon from '@mui/icons-material/Forum';
import GroupIcon from '@mui/icons-material/Group';
import {
  BaseSideBar,
  ListItem,
  UserProfile,
} from '../../../../../../components';
import {
  CHAT_ADDED_SUBSCRIPTION,
  ChatsAndFriendsContext,
  OTHER_FRIENDS_QUERY,
} from '../../../../../../contexts';
import { useAuth, useResize } from '../../../../../../hooks';
import { SideBarStyled } from './SideBar.styled';

const SideBar = () => {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('id');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [toggleChats, setToggleChats] = useState(true);
  const [toggleFriends, setToggleFriends] = useState(true);
  const selectedParam = pathname?.split?.('/')?.[1];
  const { auth: { _id = '' } = {} } = useAuth();
  const { height } = useResize();
  const {
    chats = [],
    otherFriends = [],
    pendingRequestsCount = 0,
    sentRequestsCount = 0,
    otherFriendsClient,
    subscribeChatsToMore,
    friendDetails,
    setFriendDetails,
  } = useContext(ChatsAndFriendsContext);

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
    const chatsUnsubscribe = subscribeChatsToMore({
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
      chatsUnsubscribe();
    };
  }, [_id, otherFriends, otherFriendsClient, subscribeChatsToMore]);

  const handleClickOverviewItem = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    link: string,
  ) => {
    navigate(link);
  };

  const handleClickChat = async (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chat: any,
  ) => {
    if (chat?._id) {
      navigate(`/chat?id=${chat?._id}`);
    }
  };

  const handleClickFriend = async (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    friend: any,
    otherFriend: any,
  ) => {
    const details = {
      ...friend,
      otherFriend,
    };
    setFriendDetails(details);
    navigate('/chat');
  };

  const renderUserProfile = (obj: any, handleClick: any, selected: boolean) => {
    const member = obj?.members?.find(
      (chatMember: any) => chatMember?._id !== _id,
    );
    if (member) {
      const email = member?.memberDetails?.email;
      return (
        <UserProfile
          primaryText={{
            title: member?.memberDetails?.name,
            fontSize: '1.06rem',
            fontWeight: 400,
          }}
          secondaryText={{
            title:
              email && email?.length > 27
                ? `${email?.substring(0, 27)}...`
                : email,
            fontSize: '0.85rem',
            fontWeight: 400,
          }}
          picture={member?.memberDetails?.picture}
          padding="0.15rem 0px"
          avatarWidth={40}
          avatarHeight={40}
          dense
          onClick={(_) => handleClick(_, obj, member)}
          selected={selected}
        />
      );
    }
    return null;
  };

  return (
    <BaseSideBar>
      <SideBarStyled>
        {chats?.length || otherFriends?.length ? (
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0rem',
            }}
          >
            <Button
              startIcon={<ForumIcon />}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
              variant="outlined"
              color="info"
            >
              New Chat
            </Button>
            <Button
              startIcon={<GroupIcon />}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
              variant="outlined"
              color="info"
            >
              New Group
            </Button>
          </div>
        ) : null}
        <div
          className="sidebar-middle-wrapper"
          style={{
            height: height - 210,
          }}
        >
          {chats?.length ? (
            <div className="chats-menu-wrapper">
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
                    padding: '0.4rem 0.4rem 0.4rem 0rem',
                  }}
                >
                  <Typography
                    className="sidebar-heading heading"
                    fontFamily="unset"
                    fontWeight={800}
                  >
                    Chats
                  </Typography>
                  {toggleChats ? <ExpandLessIcon /> : <ExpandCircleDownIcon />}
                </div>
              </ListItem>
              <div className="chats-wrapper">
                {toggleChats &&
                  chats?.map((chat: any, idx: number) =>
                    renderUserProfile(
                      chat,
                      handleClickChat,
                      idx ===
                        chats?.findIndex((el: any) =>
                          chatId?.includes(el?._id),
                        ),
                    ),
                  )}
              </div>
            </div>
          ) : null}
          {otherFriends?.length ? (
            <div className="your-friends-menu-wrapper">
              <ListItem
                dense
                btnSx={{ p: 0 }}
                onClick={() => setToggleFriends((prev) => !prev)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    padding: '0.4rem 0.4rem 0.4rem 0rem',
                  }}
                >
                  <Typography
                    className="sidebar-heading"
                    fontFamily="unset"
                    fontWeight={700}
                  >
                    {chats?.length ? 'Other friends' : 'Your friends'}
                  </Typography>
                  {toggleFriends ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandCircleDownIcon />
                  )}
                </div>
              </ListItem>
              <div className="friends-wrapper">
                {toggleFriends &&
                  otherFriends?.map((otherFriend: any, idx: number) =>
                    renderUserProfile(
                      otherFriend,
                      handleClickFriend,
                      idx ===
                        otherFriends?.findIndex((el: any) =>
                          friendDetails?._id?.includes(el?._id),
                        ),
                    ),
                  )}
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
                        (el) => selectedParam === el?.link?.split?.('/')?.[1],
                      )
                    }
                    onClick={(_) => handleClickOverviewItem(_, navLink?.link)}
                    // secondaryAction={
                    //   navLink?.count ? (
                    //     <div className="secondary-action-count">
                    //       {navLink?.count}
                    //     </div>
                    //   ) : null
                    // }
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </SideBarStyled>
    </BaseSideBar>
  );
};

export default SideBar;
