import { List } from '@mui/material';
import { Button, ListItem } from '../../../../components';
import { useAuth } from '../../../../hooks';
import { renderMember } from '../../../../helpers';
import { MainLayout } from '..';
import { FriendRequestStyled } from './FriendRequest.styled';

const FriendRequest = ({
  data,
  nameKey,
  emailKey,
  pictureKey,
  mainLayoutProps,
  confirmBtnProps,
  deleteBtnProps,
}: any) => {
  const { auth: { _id = '' } = {} } = useAuth();
  const isConfirmBtn = !!Object.keys(confirmBtnProps || {})?.length;
  const isDeleteBtn = !!Object.keys(deleteBtnProps || {})?.length;

  const renderItem = (item: any, key: string) => {
    if (item && key) {
      const { otherMember } = renderMember(item?.members, _id);
      return otherMember?.[key];
    }
    return null;
  };

  return (
    <FriendRequestStyled isConfirmBtn={isConfirmBtn}>
      <MainLayout
        data={data}
        loaderProps={{
          primaryFontSize: '1.125rem',
          secondaryFontSize: '1rem',
          listClassName: 'friend-request-list',
          btnAlignItems: 'flex-start',
          btnClassName: 'friend-request-loader',
          avatarClassName: 'friend-request-avatar',
          listItemTextClassName: 'friend-request-text-wrapper',
        }}
        {...mainLayoutProps}
      >
        <div className="friend-request-list-wrapper">
          <List disablePadding className="friend-request-list">
            {data?.map((item: any, idx: number) => (
              <ListItem
                key={`${item?._id}-${idx}`}
                disableGutters
                disableHover
                btnProps={{
                  wrapperClassName: 'friend-request-list-item-btn',
                  alignItems: 'flex-start',
                  avatarProps: {
                    src: renderItem(item, pictureKey),
                    className: 'friend-request-avatar',
                  },
                  textProps: {
                    primary: renderItem(item, nameKey),
                    secondary: (
                      <>
                        <span
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {renderItem(item, emailKey)}
                        </span>
                        <div className="friend-request-action-btn-wrapper">
                          {isConfirmBtn ? (
                            <Button
                              variant="contained"
                              color="secondary"
                              fullWidth
                              onClick={(_) =>
                                confirmBtnProps?.onClick(_, idx, item)
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
                                deleteBtnProps?.onClick(_, idx, item)
                              }
                            >
                              Delete
                            </Button>
                          ) : null}
                        </div>
                      </>
                    ),
                    primaryTypographyProps: {
                      fontSize: '1.125rem',
                      style: {
                        WebkitLineClamp: 1,
                      },
                    },
                    secondaryTypographyProps: {
                      fontSize: '1rem',
                      component: 'div' as any,
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
