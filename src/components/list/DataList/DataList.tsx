import { useLayoutEffect, useRef, useState } from 'react';
import { Divider, List } from '@mui/material';
import { useAuth } from '../../../hooks';
import { ListItem } from '..';

const DataList = ({
  data,
  // sliceDataBy,
  selectedItem,
  handleClickListItem,
  className,
  scrollDependencies = [],
  ellipsesLineClamp = '',
  btnHeight = '',
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
      const scrollPos = topPos - listHeight / 2 + itemHeight / 2;
      listElement?.scrollTo({ top: scrollPos, behavior: 'smooth' });
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
            disableGutters
            primaryText={{
              title: member?.memberDetails?.name,
              fontSize: '1.08rem',
            }}
            secondaryText={{
              title: member?.memberDetails?.email,
              fontSize: '0.85rem',
              ellipsesLineClamp,
            }}
            avatar={{
              src: member?.memberDetails?.picture,
            }}
            onClick={(_) => handleClick(_, obj, member)}
            sx={hasScrollbar ? { mr: '1.5rem' } : {}}
            selected={selected}
            btnHeight={btnHeight}
            // eslint-disable-next-line no-return-assign, no-param-reassign
            ref={itemsRef ? (el) => (itemsRef.current[idx] = el) : null}
          />
          <Divider variant="middle" sx={hasScrollbar ? { mr: '2.5rem' } : {}} />
        </List>
      );
    }
    return null;
  };

  return (
    <div className={className} ref={listRef}>
      {data
        ?.slice(0, undefined)
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
