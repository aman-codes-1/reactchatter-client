/* eslint-disable arrow-body-style */
import { Avatar, Grid, Typography } from '@mui/material';
import { memo } from 'react';

const ChatRoom = ({ messageGroups, friendAvatarSrc }: any) => {
  const attachClass = (messages: any, index: number, side: string) => {
    if (index === 0) {
      return `${side}First`;
    }
    if (index === messages.length - 1) {
      return `${side}Last`;
    }
    return '';
  };

  const renderChat = (
    message: any,
    messages: any,
    side: string,
    index: number,
  ) => (
    <div className={`${side}Row`} key={message?._id}>
      <Typography
        align="left"
        className={`msg ${side} ${attachClass(messages, index, side)}`}
      >
        {message?.message}
      </Typography>
    </div>
  );

  return (
    <div>
      {messageGroups?.length
        ? messageGroups.map((messages: any) => (
            <Grid
              container
              spacing={2}
              justifyContent={
                messages?.side === 'right' ? 'flex-end' : 'flex-start'
              }
            >
              {messages?.side === 'left' && (
                <Grid item>
                  <Avatar className="avatar" src={friendAvatarSrc} />
                </Grid>
              )}
              <Grid item xs={8}>
                {messages?.data?.length
                  ? messages?.data?.map((message: any, index: number) =>
                      renderChat(
                        message,
                        messages?.data,
                        messages?.side,
                        index,
                      ),
                    )
                  : null}
              </Grid>
            </Grid>
          ))
        : 'No Messages Sent'}
    </div>
  );
};

export default ChatRoom;
