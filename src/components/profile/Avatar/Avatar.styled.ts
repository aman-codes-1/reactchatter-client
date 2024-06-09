/* eslint-disable no-unused-vars */
import { styled } from '@mui/system';

export const AvatarStyled = styled('div')<{ width: string; height: string }>(
  ({ theme, width, height }) => ({
    '.MuiAvatar-root': {
      fontSize: '1rem',
      width: width || '',
      height: height || '',
    },
  }),
);
