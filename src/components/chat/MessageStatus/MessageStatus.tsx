import { useTheme } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import { checkMessageStatus } from '../../../helpers';

const MessageStatus = ({
  msg,
  messageStatus,
  selectedChat,
  color,
  readColor,
}: any) => {
  const theme = useTheme();

  const { isQueued, isSent, isDelivered, isRead } =
    (msg && selectedChat
      ? checkMessageStatus(msg, selectedChat)
      : messageStatus) || {};

  return (
    <>
      {isQueued ? (
        <AccessTimeIcon
          fontSize="inherit"
          sx={{
            color: color || theme.palette.text.secondary,
          }}
        />
      ) : null}
      {isSent ? (
        <DoneRoundedIcon
          fontSize="inherit"
          sx={{
            color: color || theme.palette.text.secondary,
          }}
        />
      ) : null}
      {isDelivered ? (
        <DoneAllRoundedIcon
          fontSize="inherit"
          sx={{
            color: color || theme.palette.text.secondary,
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
