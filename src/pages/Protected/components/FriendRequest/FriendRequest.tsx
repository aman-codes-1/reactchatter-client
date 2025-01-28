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
          btnClassName: 'friend-request-loader',
          avatarClassName: 'friend-request-avatar',
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
                  avatarProps: {
                    src: renderItem(item, pictureKey),
                    className: 'friend-request-avatar',
                  },
                  textProps: {
                    primary: renderItem(item, nameKey),
                    secondary: renderItem(item, emailKey),
                    slotProps: {
                      primary: {
                        fontSize: '1.125rem',
                      },
                      secondary: {
                        fontSize: '1rem',
                      },
                    },
                    style: {
                      WebkitLineClamp: 1,
                    },
                  },
                  wrapperClassName: 'friend-request-list-item-btn',
                  wrapperChildren: (
                    <div className="friend-request-action-btn-wrapper">
                      {isConfirmBtn ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          fullWidth
                          onClick={(_) =>
                            confirmBtnProps?.onClick(_, idx, item)
                          }
                          wrapperClassName="flex-item-action-btn"
                        >
                          Confirm
                        </Button>
                      ) : null}
                      {isDeleteBtn ? (
                        <Button
                          variant="contained"
                          color="inherit"
                          fullWidth
                          onClick={(_) => deleteBtnProps?.onClick(_, idx, item)}
                          wrapperClassName={
                            isConfirmBtn
                              ? 'flex-item-action-btn'
                              : 'flex-item-action-btn-2'
                          }
                        >
                          Delete
                        </Button>
                      ) : null}
                    </div>
                  ),
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
