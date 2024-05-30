import { ReactNode } from 'react';
import { ListItemButtonProps } from '@mui/material';

export type UserProfileProps = {
  primaryText: any;
  secondaryText: any;
  picture: string;
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
