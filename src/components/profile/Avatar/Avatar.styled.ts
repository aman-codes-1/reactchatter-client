import { styled } from '@mui/system';

export const AvatarStyled = styled('div')<{ width: string; height: string }>(
  ({ theme, width, height }) => ({
    '.MuiAvatar-root': {
      fontSize: '1rem',
      width: width || 40,
      height: height || 40,
    },
  }),
);
