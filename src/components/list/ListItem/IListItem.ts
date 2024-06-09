import { ReactNode } from 'react';
import {
  ListItemProps as MuiListItemProps,
  ListItemButtonProps,
} from '@mui/material';

export type ListItemProps = {
  primaryText?: any;
  secondaryText?: any;
  listItemIcon?: ReactNode;
  isAvatar?: boolean;
  picture?: string;
  width?: string;
  padding?: string;
  minHeight?: string;
  avatarWidth?: number;
  avatarHeight?: number;
  disableHover?: boolean;
  disabled?: ListItemButtonProps['disabled'];
  secondaryAction?: MuiListItemProps['secondaryAction'];
  dense?: MuiListItemProps['dense'];
  selected?: ListItemButtonProps['selected'];
  onClick?: ListItemButtonProps['onClick'];
  btnSx?: ListItemButtonProps['sx'];
  children?: ReactNode;
};
