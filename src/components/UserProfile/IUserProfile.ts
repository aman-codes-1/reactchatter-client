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
  disabled?: boolean;
  secondaryAction?: ReactNode;
  dense?: boolean;
  selected?: boolean;
  onClick?: ListItemButtonProps['onClick'];
};
