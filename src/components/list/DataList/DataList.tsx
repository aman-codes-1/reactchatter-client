import { useLayoutEffect, useRef, useState } from 'react';
import { Divider, List } from '@mui/material';
import { useAuth } from '../../../hooks';
import { ListItem } from '..';

const DataList = ({
  data,
  sliceDataBy,
  selectedItem,
  handleClickListItem,
  className,
  scrollDependencies = [],
  ellipsesLineClamp = '',
}: any) => {
  const { auth: { _id = '' } = {} } = useAuth();
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const listRef = useRef<any>(null);
  const listItemsRef = useRef<any>([]);

  const checkScrollBar = (ref: any) => {
    const listElement = ref?.current;
    if (listElement) {
      setHasScrollbar(listElement?.scrollHeight > listElement?.clientHeight);
    }
  };

  const scrollToSelected = (
    listItems: any[],
    ref: any,
    itemsRef: any,
    selectedListItem: any,
  ) => {
    const selectedItemIndex = listItems?.indexOf(selectedListItem);
    const listElement = ref?.current;
    const itemElement = itemsRef?.current?.[selectedItemIndex];
    if (selectedItemIndex !== -1 && listElement && itemElement) {
      const itemRect = itemElement?.getBoundingClientRect();
      const listRect = listElement?.getBoundingClientRect();
      const { scrollTop } = listElement || {};
      const topPos = itemRect.top - listRect.top + scrollTop;
      const itemHeight = itemRect.height;
      const listHeight = listRect.height;
      // eslint-disable-next-line prettier/prettier
      const scrollPos = topPos - listHeight / 2 + itemHeight / 2;
      listElement.scrollTo({ top: scrollPos, behavior: 'smooth' });
    }
  };

  useLayoutEffect(() => {
    if (data?.length) {
      checkScrollBar(listRef);
      scrollToSelected(data, listRef, listItemsRef, selectedItem);
    }
    const listRefObserver = new MutationObserver(() => checkScrollBar(listRef));
    const listElement = listRef?.current;
    if (listElement) {
      listRefObserver?.observe(listElement, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
    return () => {
      listRefObserver?.disconnect();
    };
  }, [data, selectedItem, ...scrollDependencies]);

  const renderList = (
    obj: any,
    idx: number,
    selected: boolean,
    handleClick: any,
    itemsRef?: any,
  ) => {
    const member = obj?.members?.find(
      (chatMember: any) => chatMember?._id !== _id,
    );
    if (member) {
      return (
        <List dense disablePadding>
          <ListItem
            primaryText={{
              title: member?.memberDetails?.name,
              fontSize: '1.08rem',
              fontWeight: 600,
            }}
            secondaryText={{
              title: member?.memberDetails?.email,
              fontSize: '0.85rem',
              fontWeight: 500,
              ellipsesLineClamp,
            }}
            isAvatar
            picture={member?.memberDetails?.picture}
            padding="0.15rem 0px"
            avatarWidth={40}
            avatarHeight={40}
            dense
            onClick={(_) => handleClick(_, obj, member)}
            width={hasScrollbar ? '95%' : '100%'}
            selected={selected}
            // eslint-disable-next-line no-return-assign, no-param-reassign
            ref={itemsRef ? (el) => (itemsRef.current[idx] = el) : null}
          />
          <Divider sx={{ width: hasScrollbar ? '95%' : '100%' }} />
        </List>
      );
    }
    return null;
  };

  return (
    <div className={className} ref={listRef}>
      {data
        ?.slice(0, sliceDataBy)
        ?.map((obj: any, idx: number) =>
          renderList(
            obj,
            idx,
            obj === selectedItem,
            handleClickListItem,
            listItemsRef,
          ),
        )}
    </div>
  );
};

export default DataList;
