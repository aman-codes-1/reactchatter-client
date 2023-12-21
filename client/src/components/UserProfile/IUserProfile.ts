import { ReactNode } from 'react';
import { ListItemButtonProps } from '@mui/material';

export type UserProfileProps = {
  picture: string;
  name: string;
  email?: string;
  padding?: string;
  avatarWidth?: number;
  avatarHeight?: number;
  disableHover?: boolean;
  secondaryAction?: ReactNode;
  dense?: boolean;
  onClick?: ListItemButtonProps['onClick'];
};
