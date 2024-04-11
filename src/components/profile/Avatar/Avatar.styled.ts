import { styled } from '@mui/system';

export const AvatarStyled = styled('div')<{ width: string; height: string }>(
  ({ theme, width, height }) => ({
    '.MuiAvatar-root': {
      fontSize: '1rem',
      width: `${width || 32}px`,
      height: `${height || 32}px`,
    },
  }),
);
