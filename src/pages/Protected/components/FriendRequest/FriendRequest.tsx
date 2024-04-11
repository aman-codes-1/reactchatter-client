import { Avatar, Icon, IconButton, Skeleton, Typography } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { FriendRequestStyled } from './FriendRequest.styled';

const FriendRequest = ({
  loading,
  data,
  error,
  userObj,
  emailKey,
  acceptBtnProps,
  cancelBtnProps,
}: any) => {
  const isAcceptBtn = !!Object.keys(acceptBtnProps || {})?.length;
  const isCancelBtn = !!Object.keys(cancelBtnProps || {})?.length;

  return (
    <FriendRequestStyled>
      {loading ? (
        <div style={{ marginTop: 7 }} className="sent-requests-wrapper">
          <div className="sent-requests-email-wrapper">
            <Skeleton variant="circular">
              <Avatar sx={{ width: 24, height: 24 }} />
            </Skeleton>
            <Skeleton width={200} />
          </div>
          <div className="sent-requests-btn-wrapper">
            {isAcceptBtn ? (
              <Skeleton sx={{ mr: '0.875rem' }} variant="circular">
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                  }}
                />
              </Skeleton>
            ) : null}
            {isCancelBtn ? (
              <Skeleton sx={{ mr: '0.5rem' }} variant="circular">
                <Avatar sx={{ width: 32, height: 32 }} />
              </Skeleton>
            ) : null}
          </div>
        </div>
      ) : null}
      {!loading && !error && data?.length
        ? data.map((obj: any, idx: number) => (
            <div className="sent-requests-wrapper">
              <div className="sent-requests-email-wrapper">
                <Icon className="sent-requests-email-icon">
                  <PersonAddAltOutlinedIcon />
                </Icon>
                <Typography
                  className="sent-requests-email"
                  fontFamily="unset"
                  fontWeight={600}
                >
                  {obj?.[userObj]?.[emailKey]}
                </Typography>
              </div>
              <div className="sent-requests-btn-wrapper">
                {isAcceptBtn ? (
                  <IconButton
                    size="small"
                    className="sent-requests-accept-btn"
                    onClick={(_) => acceptBtnProps?.handleClickAccept(_, idx)}
                  >
                    <CheckCircleIcon
                      fontSize="large"
                      className="sent-requests-accept-btn-icon"
                    />
                  </IconButton>
                ) : null}
                {isCancelBtn ? (
                  <IconButton
                    size="small"
                    className="sent-requests-cancel-btn"
                    onClick={(_) => cancelBtnProps?.handleClickCancel(_, idx)}
                  >
                    <CancelIcon
                      fontSize="large"
                      className="sent-requests-cancel-btn-icon"
                    />
                  </IconButton>
                ) : null}
              </div>
            </div>
          ))
        : null}
    </FriendRequestStyled>
  );
};

export default FriendRequest;
