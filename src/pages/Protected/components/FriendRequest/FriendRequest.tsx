import { IconButton, List } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../../../../hooks';
import { ListItem } from '../../../../components';
import { FriendRequestStyled } from './FriendRequest.styled';
import { useLayoutEffect, useRef, useState } from 'react';

const FriendRequest = ({
  data,
  userObj,
  nameKey,
  emailKey,
  pictureKey,
  acceptBtnProps,
  cancelBtnProps,
}: any) => {
  const { auth: { _id = '' } = {} } = useAuth();
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const listRef = useRef<any>(null);

  const isAcceptBtn = !!Object.keys(acceptBtnProps || {})?.length;
  const isCancelBtn = !!Object.keys(cancelBtnProps || {})?.length;

  const checkScrollBar = (ref: any) => {
    const listElement = ref?.current;
    if (listElement) {
      setHasScrollbar(listElement?.scrollHeight > listElement?.clientHeight);
    }
  };

  useLayoutEffect(() => {
    if (data?.length) {
      checkScrollBar(listRef);
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
  }, [data]);

  const renderItem = (obj: any, key: string) => {
    if (obj?.members?.length) {
      const memeberObj = obj.members?.find(
        (member: any) => member?._id !== _id,
      );
      if (memeberObj) {
        return memeberObj?.[userObj]?.[key];
      }
      return null;
    }
    return null;
  };

  return (
    <FriendRequestStyled
      ref={listRef}
      isAcceptBtn={isAcceptBtn}
      hasScrollbar={hasScrollbar}
    >
      <List dense className="friend-request-list">
        {data?.map((obj: any, idx: number) => (
          <div key={obj?._id} className="friend-request-wrapper">
            <ListItem
              disableHover
              disableGutters
              denseListItemButton
              primaryText={{
                title: renderItem(obj, nameKey),
                fontSize: '1.08rem',
              }}
              secondaryText={{
                title: renderItem(obj, emailKey),
                fontSize: '1rem',
              }}
              avatar={{
                src: renderItem(obj, pictureKey),
              }}
            />
            <div className="friend-request-btn-wrapper">
              {isAcceptBtn ? (
                <IconButton
                  edge="end"
                  size="small"
                  className="friend-request-accept-btn margin-left-right"
                  onClick={(_) =>
                    acceptBtnProps?.handleClickAccept(_, idx, obj)
                  }
                >
                  <CheckCircleIcon
                    fontSize="large"
                    className="friend-request-accept-btn-icon"
                  />
                </IconButton>
              ) : null}
              {isCancelBtn ? (
                <IconButton
                  edge="end"
                  size="small"
                  className="friend-request-cancel-btn margin-left-right"
                  onClick={(_) =>
                    cancelBtnProps?.handleClickCancel(_, idx, obj)
                  }
                >
                  <CancelIcon
                    fontSize="large"
                    className="friend-request-cancel-btn-icon"
                  />
                </IconButton>
              ) : null}
            </div>
          </div>
        ))}
      </List>
    </FriendRequestStyled>
  );
};

export default FriendRequest;
