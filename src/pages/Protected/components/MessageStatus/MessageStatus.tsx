import { useTheme } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import { checkMessageStatus } from '../../../../helpers';

const MessageStatus = ({
  msg,
  messageStatus,
  selectedItem,
  color,
  readColor,
}: any) => {
  const theme = useTheme();

  const { isQueued, isSent, isDelivered, isRead } =
    messageStatus || checkMessageStatus(msg, selectedItem) || {};

  return (
    <>
      {isQueued ? (
        <AccessTimeIcon
          fontSize="inherit"
          sx={{
            color: color || theme.palette.grey[700],
          }}
        />
      ) : null}
      {isSent ? (
        <DoneRoundedIcon
          fontSize="inherit"
          sx={{
            color: color || theme.palette.grey[700],
          }}
        />
      ) : null}
      {isDelivered ? (
        <DoneAllRoundedIcon
          fontSize="inherit"
          sx={{
            color: color || theme.palette.grey[700],
          }}
        />
      ) : null}
      {isRead ? (
        <DoneAllRoundedIcon
          fontSize="inherit"
          sx={{
            color: readColor || theme.palette.primary.main,
          }}
        />
      ) : null}
    </>
  );
};

export default MessageStatus;
