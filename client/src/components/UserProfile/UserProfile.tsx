import { ReactNode, useLayoutEffect, useState } from 'react';
import { ListItemAvatar } from '@mui/material';
import { Avatar } from '../Avatar';
import { checkIfImageExists } from '../../helpers';
import { ListItem } from '..';
import { UserProfileStyled } from './UserProfile.styled';
import { UserProfileProps } from './IUserProfile';

const UserProfile = ({
  picture,
  name,
  email,
  padding = '',
  avatarWidth,
  avatarHeight,
  disableHover = false,
  secondaryAction,
  dense = false,
}: UserProfileProps) => {
  const [avatar, setAvatar] = useState<ReactNode>();

  useLayoutEffect(() => {
    const getAvatar = () => {
      checkIfImageExists(picture, (exists) => {
        if (exists) {
          setAvatar(
            <Avatar
              alt={name}
              src={picture}
              width={avatarWidth}
              height={avatarHeight}
            />,
          );
        } else {
          setAvatar(
            <Avatar width={avatarWidth} height={avatarHeight}>
              {name?.length ? name?.substring(0, 1).toUpperCase() : null}
            </Avatar>,
          );
        }
      });
    };
    getAvatar();
  }, []);

  return (
    <UserProfileStyled>
      <ListItem
        primaryText={name}
        secondaryText={email}
        padding={padding}
        secondaryAction={secondaryAction}
        disableHover={disableHover}
        dense={dense}
        listItemIcon={(
          <ListItemAvatar className="list-item-avatar">
            {avatar || <Avatar width={avatarWidth} height={avatarHeight} />}
          </ListItemAvatar>
        )}
      />
    </UserProfileStyled>
  );
};

export default UserProfile;
