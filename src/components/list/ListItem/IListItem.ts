import { ReactNode } from 'react';
import { ListItemProps as MuiListItemProps } from '@mui/material';
import { ListItemButtonProps } from '../ListItemButton/IListItemButton';

export interface ListItemProps extends ListItemButtonProps {
  width?: string;
  btnWidth?: ListItemButtonProps['width'];
  btnClassName?: ListItemButtonProps['className'];
  btnChildren?: ListItemButtonProps['children'];
  disableHover?: boolean;
  denseListItem?: MuiListItemProps['dense'];
  disableGutters?: MuiListItemProps['disableGutters'];
  disablePadding?: MuiListItemProps['disablePadding'];
  secondaryAction?: MuiListItemProps['secondaryAction'];
  className?: MuiListItemProps['className'];
  children?: MuiListItemProps['children'];
}
