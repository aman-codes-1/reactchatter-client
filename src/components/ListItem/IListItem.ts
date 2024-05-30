import { ReactNode } from 'react';
import {
  ListItemProps as MuiListItemProps,
  ListItemButtonProps,
} from '@mui/material';

export type ListItemProps = {
  listItemIcon?: ReactNode;
  primaryText?: any;
  secondaryText?: any;
  padding?: string;
  disableHover?: boolean;
  disabled?: ListItemButtonProps['disabled'];
  secondaryAction?: MuiListItemProps['secondaryAction'];
  dense?: MuiListItemProps['dense'];
  selected?: ListItemButtonProps['selected'];
  onClick?: ListItemButtonProps['onClick'];
  btnSx?: ListItemButtonProps['sx'];
  children?: ReactNode;
};
