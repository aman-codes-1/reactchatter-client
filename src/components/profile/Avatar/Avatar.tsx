import { Avatar as MuiAvatar } from '@mui/material';
import { AvatarStyled } from './Avatar.styled';

const Avatar = ({ alt, src, width, height, slotProps, children }: any) => (
  <AvatarStyled width={width} height={height}>
    <MuiAvatar alt={alt} src={src} slotProps={slotProps}>
      {children}
    </MuiAvatar>
  </AvatarStyled>
);

export default Avatar;
