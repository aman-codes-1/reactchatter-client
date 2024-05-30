import { Avatar as MuiAvatar } from '@mui/material';
import { AvatarStyled } from './Avatar.styled';

const Avatar = ({ alt, src, width, height, children }: any) => (
  <AvatarStyled width={width} height={height}>
    <MuiAvatar
      alt={alt}
      src={src}
      slotProps={{ img: { referrerPolicy: 'no-referrer' } }}
    >
      {children}
    </MuiAvatar>
  </AvatarStyled>
);

export default Avatar;
