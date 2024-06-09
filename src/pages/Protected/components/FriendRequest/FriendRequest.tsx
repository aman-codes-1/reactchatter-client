import { IconButton, List, Skeleton } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../../../../hooks';
import { FriendRequestStyled } from './FriendRequest.styled';
import { Avatar, ListItem } from '../../../../components';

const FriendRequest = ({
  loading,
  data,
  error,
  userObj,
  emailKey,
  acceptBtnProps,
  cancelBtnProps,
}: any) => {
  const { auth: { _id = '' } = {} } = useAuth();
  const isAcceptBtn = !!Object.keys(acceptBtnProps || {})?.length;
  const isCancelBtn = !!Object.keys(cancelBtnProps || {})?.length;

  return (
    <FriendRequestStyled isAcceptBtn={isAcceptBtn}>
      {loading ? (
        <div style={{ marginTop: 7 }} className="sent-requests-wrapper">
          <div className="sent-requests-email-wrapper">
            <Skeleton variant="circular">
              <Avatar width={24} height={24} />
            </Skeleton>
            <Skeleton width={200} />
          </div>
          <div className="sent-requests-btn-wrapper">
            {isAcceptBtn ? (
              <Skeleton sx={{ mr: '0.875rem' }} variant="circular">
                <Avatar width={32} height={32} />
              </Skeleton>
            ) : null}
            {isCancelBtn ? (
              <Skeleton sx={{ mr: '0.5rem' }} variant="circular">
                <Avatar width={32} height={32} />
              </Skeleton>
            ) : null}
          </div>
        </div>
      ) : null}
      {!loading && !error && data?.length
        ? data.map((obj: any, idx: number) => (
            <List dense>
              <ListItem
                disableHover
                disableGutters
                primaryText={{
                  title: obj?.members?.length
                    ? obj.members?.find((member: any) => member?._id !== _id)?.[
                        userObj
                      ]?.[emailKey]
                    : null,
                  // ellipsesLineClamp: '1',
                  fontSize: '1rem',
                }}
                sx={isAcceptBtn ? { mr: 3 } : {}}
                className="sent-requests-wrapper"
                startIcon={<PersonAddAltOutlinedIcon sx={{ mr: 2 }} />}
                secondaryAction={
                  <div className="sent-requests-btn-wrapper">
                    {isAcceptBtn ? (
                      <IconButton
                        edge="end"
                        size="small"
                        className="sent-requests-accept-btn margin-left-right"
                        onClick={(_) =>
                          acceptBtnProps?.handleClickAccept(_, idx, obj)
                        }
                      >
                        <CheckCircleIcon
                          fontSize="large"
                          className="sent-requests-accept-btn-icon"
                        />
                      </IconButton>
                    ) : null}
                    {isCancelBtn ? (
                      <IconButton
                        edge="end"
                        size="small"
                        className="sent-requests-cancel-btn margin-left-right"
                        onClick={(_) =>
                          cancelBtnProps?.handleClickCancel(_, idx, obj)
                        }
                      >
                        <CancelIcon
                          fontSize="large"
                          className="sent-requests-cancel-btn-icon"
                        />
                      </IconButton>
                    ) : null}
                  </div>
                }
              />
            </List>
          ))
        : null}
    </FriendRequestStyled>
  );
};

export default FriendRequest;
