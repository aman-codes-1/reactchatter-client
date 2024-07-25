import { ReactNode } from 'react';
import {
  ListItemButtonProps as MuiListItemButtonProps,
  ListItemTextProps,
} from '@mui/material';

export type ListItemButtonProps = {
  width?: string;
  btnHeight?: string;
  variant?: string;
  disableHover?: boolean;
  primaryText?: any;
  secondaryText?: any;
  avatar?: any;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  alignItems?: MuiListItemButtonProps['alignItems'];
  denseListItemButton?: MuiListItemButtonProps['dense'];
  disabled?: MuiListItemButtonProps['disabled'];
  selected?: MuiListItemButtonProps['selected'];
  onClick?: MuiListItemButtonProps['onClick'];
  sx?: MuiListItemButtonProps['sx'];
  listItemTextSx?: ListItemTextProps['sx'];
  className?: MuiListItemButtonProps['className'];
  children?: MuiListItemButtonProps['children'];
};
