import { ReactNode } from 'react';
import {
  ListItemProps as MuiListItemProps,
  ListItemButtonProps,
} from '@mui/material';

export type ListItemProps = {
  primaryText?: any;
  secondaryText?: any;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  isAvatar?: boolean;
  picture?: string;
  width?: string;
  minHeight?: string;
  btnHeight?: string;
  avatarWidth?: number;
  avatarHeight?: number;
  disableGutters?: MuiListItemProps['disableGutters'];
  disablePadding?: MuiListItemProps['disablePadding'];
  denseListItem?: MuiListItemProps['dense'];
  denseListItemButton?: ListItemButtonProps['dense'];
  disableHover?: boolean;
  disabled?: ListItemButtonProps['disabled'];
  secondaryAction?: MuiListItemProps['secondaryAction'];
  selected?: ListItemButtonProps['selected'];
  onClick?: ListItemButtonProps['onClick'];
  sx?: ListItemButtonProps['sx'];
  className?: string;
  children?: ReactNode;
};
