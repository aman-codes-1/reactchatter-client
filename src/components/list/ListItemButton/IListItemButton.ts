import { ReactNode } from 'react';
import { ListItemButtonProps as MuiListItemButtonProps } from '@mui/material';

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
  denseListItemButton?: MuiListItemButtonProps['dense'];
  disabled?: MuiListItemButtonProps['disabled'];
  selected?: MuiListItemButtonProps['selected'];
  onClick?: MuiListItemButtonProps['onClick'];
  sx?: MuiListItemButtonProps['sx'];
  className?: MuiListItemButtonProps['className'];
  children?: MuiListItemButtonProps['children'];
};
