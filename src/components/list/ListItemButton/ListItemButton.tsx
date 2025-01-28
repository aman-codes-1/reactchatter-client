import { forwardRef } from 'react';
import {
  ListItemAvatar,
  ListItemButton as MuiListItemButton,
  ListItemText,
} from '@mui/material';
import { Avatar } from '../..';
import { ListItemButtonProps } from './IListItemButton';
import { ListItemButtonStyled } from './ListItemButton.styled';

const ListItemButton = forwardRef<HTMLDivElement, ListItemButtonProps>(
  (props, ref) => {
    const {
      width = '',
      height = '',
      disableHover = false,
      startIcon,
      endIcon,
      wrapperClassName,
      wrapperChildren,
      className,
      avatarProps,
      textProps,
      children,
      ...rest
    } = props;
    const name = (textProps?.primary as string) || '';
    const isAvatar = !!Object.keys(avatarProps || {})?.length;
    const isText = !!Object.keys(textProps || {})?.length;

    const renderAvatar = () => {
      if (name?.length && avatarProps?.src?.length) {
        return <Avatar alt={name} {...avatarProps} />;
      }

      const nameFirstLetter = name?.length
        ? name?.substring(0, 1).toUpperCase()
        : '';

      return (
        <Avatar alt={nameFirstLetter} src="" {...avatarProps}>
          {nameFirstLetter}
        </Avatar>
      );
    };

    return (
      <ListItemButtonStyled
        width={width}
        disableHover={disableHover}
        primaryEllipsesLineClamp={
          textProps?.style?.WebkitLineClamp ||
          (textProps?.slotProps?.primary as any)?.style?.WebkitLineClamp
        }
        secondaryEllipsesLineClamp={
          textProps?.style?.WebkitLineClamp ||
          (textProps?.slotProps?.secondary as any)?.style?.WebkitLineClamp
        }
        className={wrapperClassName}
      >
        <MuiListItemButton
          disableRipple={disableHover}
          disableTouchRipple={disableHover}
          className={`list-item-btn ${className}`}
          ref={ref}
          {...rest}
        >
          {isAvatar ? (
            <ListItemAvatar
              sx={{ cursor: disableHover ? 'default' : 'pointer' }}
            >
              {avatarProps?.children || renderAvatar()}
            </ListItemAvatar>
          ) : null}
          {startIcon}
          {isText ? (
            <ListItemText
              {...textProps}
              slotProps={{
                primary: {
                  fontSize: '1rem',
                  fontWeight: 500,
                  ...textProps?.slotProps?.primary,
                },
                secondary: {
                  fontWeight: 470,
                  ...textProps?.slotProps?.secondary,
                },
              }}
              sx={{
                ...textProps?.sx,
                cursor: disableHover ? 'default' : 'pointer',
              }}
            />
          ) : null}
          {endIcon}
          {children}
        </MuiListItemButton>
        {wrapperChildren}
      </ListItemButtonStyled>
    );
  },
);

ListItemButton.displayName = 'ListItemButton';

export default ListItemButton;
