import { useLayoutEffect, useRef } from 'react';
import { Divider, List } from '@mui/material';
import { scrollToSelected } from '../../../helpers';
import { ListItem } from '..';

const DataList = ({
  dense = false,
  disableGutters = false,
  dividerVariant,
  data,
  selectedItem,
  handleClickListItem,
  className,
  scrollDependencies = [],
  WebkitLineClamp = 0,
}: any) => {
  const listRef = useRef<any>(null);
  const listItemsRef = useRef<any>([]);

  useLayoutEffect(() => {
    scrollToSelected(data, listRef, listItemsRef, selectedItem);

    window.addEventListener('resize', () =>
      scrollToSelected(data, listRef, listItemsRef, selectedItem),
    );

    return () => {
      window.removeEventListener('resize', () =>
        scrollToSelected(data, listRef, listItemsRef, selectedItem),
      );
    };
  }, [data, selectedItem, ...scrollDependencies]);

  const renderList = (
    item: any,
    idx: number,
    selected: boolean,
    handleClick: any,
    itemsRef: any,
  ) => {
    return (
      <div key={`${item?._id}-${idx}`}>
        <ListItem
          disableGutters={disableGutters}
          ref={itemsRef ? (el) => (itemsRef.current[idx] = el) : null}
          btnProps={{
            alignItems: 'flex-start',
            textProps: {
              primary: item?.details?.name,
              secondary: item?.details?.email,
              primaryTypographyProps: {
                fontSize: '1.0625rem',
                // fontWeight: 600, // only when there are unread messages count
                style: {
                  WebkitLineClamp: 1,
                },
              },
              secondaryTypographyProps: {
                style: {
                  WebkitLineClamp,
                },
              },
            },
            avatarProps: {
              src: item?.details?.picture,
            },
            onClick: (_) => handleClick(_, item),
            selected,
          }}
        />
        <Divider
          variant={dividerVariant || (disableGutters ? 'fullWidth' : 'middle')}
        />
      </div>
    );
  };

  return (
    <List
      dense={dense || data?.length > 4}
      disablePadding
      className={className}
      ref={listRef}
    >
      {data
        ?.slice(0, undefined)
        ?.map((item: any, idx: number) =>
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
