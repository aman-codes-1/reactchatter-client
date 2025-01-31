import { RefObject, useContext, useLayoutEffect, useRef } from 'react';
import { Divider, List, useTheme } from '@mui/material';
import { ListItem } from '../../../../components';
import { useAuth } from '../../../../hooks';
import { ChatsAndFriendsContext } from '../../../../contexts';
import { getMember, scrollToSelected } from '../../../../helpers';
import { MessageStatus } from '..';

const DataList = ({
  dense = false,
  disableGutters = false,
  dividerVariant,
  data,
  selectedItem,
  handleClickListItem,
  className,
  scrollDependencies = [],
}: any) => {
  const theme = useTheme();
  const { auth: { _id = '' } = {} } = useAuth();
  const listRef = useRef<HTMLUListElement | null>(null);
  const listItemsRef = useRef<HTMLDivElement[] | null[]>([]);
  const { isHomeButtonClicked } = useContext(ChatsAndFriendsContext);

  useLayoutEffect(() => {
    if (listRef?.current) {
      listRef.current.scrollTop = 0;
    }
  }, [isHomeButtonClicked]);

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

  const renderSecondary = (item: any, details: any) => {
    const msg = item?.lastMessage;
    let isComponent = false;
    let component = null;

    if (msg) {
      isComponent = true;
      component = (
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            alignItems: 'center',
          }}
        >
          {msg?.sender?._id && msg?.sender?._id === _id ? (
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
    } else {
      component = details?.email;
    }

    return {
      isComponent,
      component,
    };
  };

  const renderList = (
    item: any,
    idx: number,
    selected: boolean,
    handleClick: any,
    itemsRef: RefObject<HTMLDivElement[] | null[]>,
  ) => {
    let details: any;
    const isPrivateChat = item?.type === 'private';
    const isGroupChat = item?.type === 'group';
    const isFriend = item?.type === 'friend';

    if (isPrivateChat || isFriend) {
      const { otherMember } = getMember(item?.members, _id);
      details = otherMember;
    }

    if (isGroupChat) {
      details = item?.groupDetails;
    }

    const { isComponent, component } = renderSecondary(item, details);

    if (details) {
      return (
        <div key={item?._id}>
          <ListItem
            disableGutters={disableGutters}
            ref={(el) => {
              if (itemsRef?.current) {
                itemsRef.current[idx] = el;
              }
            }}
            btnProps={{
              textProps: {
                primary: details?.name,
                secondary: component,
                slotProps: {
                  primary: {
                    ...(details?.unreadMessageCount // to do
                      ? {
                          fontWeight: 600,
                        }
                      : {}),
                  },
                  secondary: {
                    ...(isComponent ? { component: 'div' as any } : {}),
                    ...(details?.unreadMessageCount // to do
                      ? {
                          fontWeight: 700,
                          style: {
                            color: theme.palette.text.primary,
                          },
                        }
                      : {}),
                  },
                },
                style: {
                  WebkitLineClamp: 1,
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
      dense={dense}
      disablePadding
      className={className}
      ref={listRef}
      sx={{ overflow: 'auto', width: '100%', minHeight: '4.6rem' }}
    >
      {data?.map((item: any, idx: number) =>
        renderList(
          item,
          idx,
          item?._id && selectedItem?._id && item?._id === selectedItem?._id,
          handleClickListItem,
          listItemsRef,
        ),
      )}
    </List>
  );
};

export default DataList;
