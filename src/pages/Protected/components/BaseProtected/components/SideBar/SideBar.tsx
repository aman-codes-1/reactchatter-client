import { useContext, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
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
  },
  {
    icon: <PeopleAltOutlinedIcon className="list-item-icon" />,
    title: 'Sent Requests',
    link: '/sentRequests',
  },
];

const SideBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [toggleChats, setToggleChats] = useState(true);
  const [toggleFriends, setToggleFriends] = useState(true);
  const selectedParam = pathname?.split?.('/')?.[1];
  const { auth: { _id = '' } = {} } = useAuth();
  const { height } = useResize();
  const {
    chats = {},
    otherFriends = {},
    otherFriendsClient,
    subscribeChatsToMore,
    chatDetails,
    setChatDetails,
  } = useContext(ChatsAndFriendsContext);

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
                  otherFriends: otherFriends?.otherFriends?.length
                    ? otherFriends?.otherFriends?.filter(
                        (otherFriend: any) =>
                          otherFriend?._id !== OnChatAddedFriendId,
                      )
                    : otherFriends?.otherFriends,
                },
                variables: {
                  userId: _id,
                },
              });
            }
            return Object.assign({}, prev, {
              chats: [OnChatAddedChat, ...prev?.chats],
            });
          }
        }
      },
    });

    return () => {
      chatsUnsubscribe();
    };
  }, [_id, otherFriends?.otherFriends, otherFriendsClient, subscribeChatsToMore]);

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
    const details = {
      _id: chat?._id,
      chatType: chat?.type,
    };
    setChatDetails(details);
    navigate('/chat');
  };

  const handleClickFriend = async (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    friend: any,
    friendDetails: any,
  ) => {
    const details = {
      _id: friend?._id,
      chatType: 'friend',
      friendDetails,
    };
    setChatDetails(details);
    navigate('/chat');
  };

  return (
    <BaseSideBar>
      {chats?.chats?.length || otherFriends?.otherFriends?.length ? (
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
        {chats?.chats?.length ? (
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
                chats?.chats?.map((chat: any, idx: number) => {
                  if (chat?.type === 'private' && chat?.members?.length) {
                    const member = chat?.members?.find(
                      (member: any) => member?._id !== _id,
                    );
                    return (
                      <UserProfile
                        picture={member?.memberDetails?.picture}
                        name={member?.memberDetails?.name}
                        email={member?.memberDetails?.email}
                        padding="0.15rem 0px"
                        avatarWidth={30}
                        avatarHeight={30}
                        dense
                        onClick={(_) => handleClickChat(_, chat)}
                        selected={
                          idx ===
                          chats?.chats?.findIndex((el: any) =>
                            chatDetails?._id?.includes(el?._id),
                          )
                        }
                      />
                    );
                  }
                  return true;
                })}
            </div>
          </div>
        ) : null}
        {otherFriends?.otherFriends?.length ? (
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
                  className="sidebar-heading heading"
                  fontFamily="unset"
                  fontWeight={800}
                >
                  {chats?.chats?.length ? 'Other friends' : 'Your friends'}
                </Typography>
                {toggleFriends ? <ExpandLessIcon /> : <ExpandCircleDownIcon />}
              </div>
            </ListItem>
            <div className="friends-wrapper">
              {toggleFriends &&
                otherFriends?.otherFriends?.map(
                  (otherFriend: any, idx: number) => {
                    if (otherFriend?.members?.length) {
                      const member = otherFriend?.members?.find(
                        (member: any) => member?._id !== _id,
                      );
                      return (
                        <UserProfile
                          picture={member?.memberDetails?.picture}
                          name={member?.memberDetails?.name}
                          email={member?.memberDetails?.email}
                          padding="0.15rem 0px"
                          avatarWidth={30}
                          avatarHeight={30}
                          dense
                          onClick={(_) => handleClickFriend(_, otherFriend, member)}
                          selected={
                            idx ===
                            otherFriends?.otherFriends?.findIndex((el: any) =>
                              chatDetails?._id?.includes(el?._id),
                            )
                          }
                        />
                      );
                    }
                    return true;
                  },
                )}
            </div>
          </div>
        ) : null}
        {navLinks?.length ? (
          <div className="overview-menu-wrapper">
            <Typography
              className="sidebar-heading"
              fontFamily="unset"
              fontWeight={800}
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
                      (el) => selectedParam === el?.link?.split?.('/')?.[1],
                    )
                  }
                  onClick={(_) => handleClickOverviewItem(_, navLink?.link)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </BaseSideBar>
  );
};

export default SideBar;
