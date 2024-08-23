import { List, Typography } from '@mui/material';
import { useAuth } from '../../../../hooks';
import { Button, ListItem } from '../../../../components';
import { FriendRequestStyled } from './FriendRequest.styled';
import { useLayoutEffect, useRef, useState } from 'react';
import { MainLayout } from '../MainLayout';

const FriendRequest = ({
  data,
  userObj,
  nameKey,
  emailKey,
  pictureKey,
  mainLayoutProps,
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
      <MainLayout
        data={data}
        loaderProps={{
          secondaryFontSize: '0.975rem',
          listClassName: 'friend-request-list',
          btnAlignItems: 'flex-start',
          btnClassName: 'friend-request-loader',
          avatarClassName: 'friend-request-loader-avatar',
          listItemTextClassName: 'friend-request-text-wrapper',
        }}
        {...mainLayoutProps}
      >
        <div className="friend-request-list-wrapper">
          <List disablePadding className="friend-request-list">
            {data?.map((obj: any, idx: number) => (
              <ListItem
                key={obj?._id}
                disableGutters
                disableHover
                btnProps={{
                  wrapperClassName: 'friend-request-list-item-btn',
                  alignItems: 'flex-start',
                  avatarProps: {
                    src: renderItem(obj, pictureKey),
                    className: 'friend-request-avatar',
                  },
                  textProps: {
                    primary: renderItem(obj, nameKey),
                    primaryTypographyProps: {
                      fontSize: '1.08rem',
                    },
                    secondary: (
                      <>
                        {renderItem(obj, emailKey)}
                        <div className="friend-request-action-btn-wrapper">
                          {isConfirmBtn ? (
                            <Button
                              variant="contained"
                              color="secondary"
                              fullWidth
                              onClick={(_) =>
                                confirmBtnProps?.onClick(_, idx, obj)
                              }
                            >
                              Confirm
                            </Button>
                          ) : null}
                          {isDeleteBtn ? (
                            <Button
                              variant="contained"
                              color="inherit"
                              fullWidth
                              onClick={(_) =>
                                deleteBtnProps?.onClick(_, idx, obj)
                              }
                            >
                              Delete
                            </Button>
                          ) : null}
                        </div>
                      </>
                    ),
                    secondaryTypographyProps: {
                      fontSize: '0.975rem',
                    },
                    className: 'friend-request-text-wrapper',
                  },
                }}
              />
            ))}
          </List>
        </div>
      </MainLayout>
    </FriendRequestStyled>
  );
};

export default FriendRequest;
