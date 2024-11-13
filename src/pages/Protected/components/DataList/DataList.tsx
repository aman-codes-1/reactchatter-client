import { useLayoutEffect, useRef } from 'react';
import { Divider, List } from '@mui/material';
import { ListItem } from '../../../../components';
import { useAuth } from '../../../../hooks';
import { renderMember, scrollToSelected } from '../../../../helpers';
import { MessageStatus } from '..';

const DataList = ({
  dense = false,
  disableGutters = false,
  dividerVariant,
  data,
  type,
  selectedItem,
  handleClickListItem,
  className,
  scrollDependencies = [],
  loading,
}: any) => {
  const { auth: { _id = '' } = {} } = useAuth();
  const listRef = useRef<any>(null);
  const listItemsRef = useRef<any>([]);

  const isChats = type === 'chats';
  const isFriends = type === 'friends';
  const isOtherFriends = type === 'otherFriends';

  useLayoutEffect(() => {
    const scrollSelected = () => {
      if (
        listRef?.current &&
        listItemsRef?.current?.length &&
        data?.length &&
        selectedItem
      ) {
        scrollToSelected(listRef, listItemsRef, data, selectedItem);
      }
    };

    scrollSelected();

    window.addEventListener('resize', scrollSelected);

    return () => {
      window.removeEventListener('resize', scrollSelected);
    };
  }, [data, selectedItem, ...scrollDependencies]);

  useLayoutEffect(() => {
    if (listRef?.current) {
      listRef.current.scrollTop = 0;
    }
  }, [loading]);

  const renderSecondary = (item: any, details: any) => {
    const msg = item?.lastMessage;

    if (msg) {
      return (
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            alignItems: 'center',
          }}
        >
          {msg?.sender?._id === _id ? (
            <MessageStatus msg={msg} selectedItem={item} />
          ) : null}
          <span
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {msg?.message}
          </span>
        </div>
      );
    }

    return details?.email;
  };

  const renderList = (
    item: any,
    idx: number,
    selected: boolean,
    handleClick: any,
    itemsRef: any,
  ) => {
    let details: any;
    const isPrivateChat = isChats && item?.type === 'private';
    const isGroupChat = isChats && item?.type === 'group';

    if (isPrivateChat || isFriends || isOtherFriends) {
      const { otherMember } = renderMember(item?.members, _id);
      details = otherMember;
    }

    if (isGroupChat) {
      details = item?.groupDetails;
    }

    const secondary = renderSecondary(item, details);

    if (details) {
      return (
        <div key={`${item?._id}-${idx}`}>
          <ListItem
            disableGutters={disableGutters}
            ref={itemsRef ? (el) => (itemsRef.current[idx] = el) : null}
            btnProps={{
              textProps: {
                primary: details?.name,
                secondary,
                primaryTypographyProps: {
                  style: {
                    WebkitLineClamp: 1,
                  },
                  ...(isChats
                    ? {
                        // fontWeight: 600, // only when unread messages
                      }
                    : {}),
                },
                secondaryTypographyProps: {
                  ...(isChats
                    ? {
                        // fontWeight: 600, // only when unread messages
                        component: 'div' as any,
                        // style: {
                        //   color: '#000000',
                        // }, // only when unread messages
                      }
                    : {
                        style: {
                          WebkitLineClamp: 1,
                        },
                      }),
                },
              },
              avatarProps: {
                src: details?.picture,
              },
              onClick: (_: any) => handleClick(_, item, details),
              selected,
            }}
          />
          <Divider
            variant={
              dividerVariant || (disableGutters ? 'fullWidth' : 'middle')
            }
            sx={
              disableGutters ? { ml: '5px', mr: '5px' } : { ml: 2.5, mr: 2.5 }
            }
          />
        </div>
      );
    }

    return null;
  };

  if (!data?.length) return null;

  return (
    <List
      dense={dense || data?.length > 4}
      disablePadding
      className={className}
      ref={listRef}
      sx={{ overflow: 'auto', width: '100%', minHeight: '4.6rem' }}
    >
      {data?.map((item: any, idx: number) =>
        renderList(
          item,
          idx,
          item?._id === selectedItem?._id,
          handleClickListItem,
          listItemsRef,
        ),
      )}
    </List>
  );
};

export default DataList;
