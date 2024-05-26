import { ReactNode, useLayoutEffect, useState } from 'react';
import { ListItemAvatar } from '@mui/material';
import { Avatar } from '../Avatar';
import { checkIfImageExists } from '../../../helpers';
import { ListItem } from '../..';
import { UserProfileStyled } from './UserProfile.styled';
import { UserProfileProps } from './IUserProfile';

const UserProfile = ({
  picture = '',
  name = '',
  email = '',
  padding = '',
  avatarWidth = 0,
  avatarHeight = 0,
  disableHover = false,
  disabled = false,
  secondaryAction,
  dense = false,
  selected = false,
  onClick,
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
              slotProps={{ img: { referrerPolicy: 'no-referrer' } }}
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
  }, [avatarHeight, avatarWidth, name, picture]);

  return (
    <UserProfileStyled>
      <ListItem
        primaryText={name}
        secondaryText={
          email && email?.length > 27 ? `${email?.substring(0, 27)}...` : email
        }
        padding={padding}
        secondaryAction={secondaryAction}
        disableHover={disableHover}
        dense={dense}
        selected={selected}
        disabled={disabled}
        listItemIcon={
          <ListItemAvatar className="list-item-avatar">
            {avatar || <Avatar width={avatarWidth} height={avatarHeight} />}
          </ListItemAvatar>
        }
        onClick={onClick}
      />
    </UserProfileStyled>
  );
};

export default UserProfile;
