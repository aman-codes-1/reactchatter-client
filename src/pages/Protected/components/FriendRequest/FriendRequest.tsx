import { IconButton, List } from '@mui/material';
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
  confirmBtnProps,
  deleteBtnProps,
}: any) => {
  const { auth: { _id = '' } = {} } = useAuth();
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const listRef = useRef<any>(null);

  const isConfirmBtn = !!Object.keys(confirmBtnProps || {})?.length;
  const isDeleteBtn = !!Object.keys(deleteBtnProps || {})?.length;

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
      const memberObj = obj.members?.find((member: any) => member?._id !== _id);
      if (memberObj) {
        return memberObj?.[userObj]?.[key];
      }
      return null;
    }
    return null;
  };

  return (
    <FriendRequestStyled
      ref={listRef}
      isConfirmBtn={isConfirmBtn}
      hasScrollbar={hasScrollbar}
    >
      <List disablePadding className="friend-request-list">
        {data?.map((obj: any, idx: number) => (
          <ListItem
            key={obj?._id}
            disableHover
            disableGutters
            primaryText={{
              title: renderItem(obj, nameKey),
              fontSize: '1.08rem',
            }}
            sx={{ gap: '1.2rem' }}
            listItemTextSx={{ mt: 1.3, mb: 1.3 }}
            secondaryText={{
              title: (
                <>
                  {renderItem(obj, emailKey)}{' '}
                  <div className="friend-request-action-btn-wrapper">
                    {isConfirmBtn ? (
                      <IconButton
                        edge="start"
                        size="small"
                        className="friend-request-confirm-btn margin-left-right"
                        onClick={(_) =>
                          confirmBtnProps?.handleClickConfirm(_, idx, obj)
                        }
                      >
                        <CheckCircleIcon
                          fontSize="large"
                          className="friend-request-confirm-btn-icon"
                        />
                      </IconButton>
                    ) : null}
                    {isDeleteBtn ? (
                      <IconButton
                        edge="end"
                        size="small"
                        className="friend-request-delete-btn margin-left-right"
                        onClick={(_) =>
                          deleteBtnProps?.handleClickDelete(_, idx, obj)
                        }
                      >
                        <CancelIcon
                          fontSize="large"
                          className="friend-request-delete-btn-icon"
                        />
                      </IconButton>
                    ) : null}
                  </div>
                </>
              ),
              fontSize: '0.975rem',
            }}
            avatar={{
              width: 60,
              height: 60,
              src: renderItem(obj, pictureKey),
            }}
            btnClassName="friend-request-btn"
            alignItems="flex-start"
          />
        ))}
      </List>
    </FriendRequestStyled>
  );
};

export default FriendRequest;
