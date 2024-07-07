import { IconButton, List } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../../../../hooks';
import { ListItem } from '../../../../components';
import { FriendRequestStyled } from './FriendRequest.styled';

const FriendRequest = ({
  data,
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
      {data?.map((obj: any, idx: number) => (
        <List dense key={`${JSON.stringify(obj)} ${idx}`}>
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
      ))}
    </FriendRequestStyled>
  );
};

export default FriendRequest;
