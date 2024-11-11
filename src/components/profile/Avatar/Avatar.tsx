import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from '@mui/material';
import { AvatarStyled } from './Avatar.styled';

interface AvatarProps extends MuiAvatarProps {
  wrapperClassName?: string;
}

const Avatar = (props: AvatarProps) => {
  const { wrapperClassName, children, ...rest } = props;

  return (
    <AvatarStyled className={wrapperClassName}>
      <MuiAvatar
        slotProps={{ img: { referrerPolicy: 'no-referrer' } }}
        {...rest}
      >
        {children}
      </MuiAvatar>
    </AvatarStyled>
  );
};

export default Avatar;
