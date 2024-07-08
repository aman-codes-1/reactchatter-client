import { forwardRef } from 'react';
import {
  ListItemAvatar,
  ListItemText,
  ListItemButton as MuiListItemButton,
} from '@mui/material';
import { Avatar } from '../..';
import { ListItemButtonProps } from './IListItemButton';
import { ListItemButtonStyled } from './ListItemButton.styled';

const ListItemButton = forwardRef(
  (
    {
      width = '',
      btnHeight = '',
      variant = '',
      disableHover = false,
      primaryText,
      secondaryText,
      avatar,
      startIcon,
      endIcon,
      denseListItemButton = false,
      disabled,
      selected,
      onClick,
      sx,
      className,
      children,
    }: ListItemButtonProps,
    ref: any,
  ) => {
    const name = primaryText?.title;
    const isAvatar = !!Object.keys(avatar || {})?.length;

    const renderAvatar = () => {
      if (name?.length && avatar?.src?.length) {
        return (
          <Avatar
            alt={name}
            src={avatar?.src}
            width={avatar?.width}
            height={avatar?.height}
          />
        );
      }
      return (
        <Avatar alt="" src="" width={avatar?.width} height={avatar?.height}>
          {name?.length ? name?.substring(0, 1).toUpperCase() : null}
        </Avatar>
      );
    };

    return (
      <ListItemButtonStyled
        width={width}
        btnHeight={btnHeight}
        variant={variant}
        disableHover={disableHover}
        primaryTextFontSize={primaryText?.fontSize}
        primaryTextFontWeight={primaryText?.fontWeight}
        primaryEllipsesLineClamp={primaryText?.ellipsesLineClamp}
        secondaryTextFontSize={secondaryText?.fontSize}
        secondaryTextFontWeight={secondaryText?.fontWeight}
        secondaryEllipsesLineClamp={secondaryText?.ellipsesLineClamp}
        className={className}
      >
        <MuiListItemButton
          dense={denseListItemButton}
          disableRipple={disableHover}
          disableTouchRipple={disableHover}
          disabled={disabled}
          selected={selected}
          className="list-item-btn"
          onClick={onClick}
          sx={sx}
          ref={ref}
        >
          {children}
          {isAvatar ? (
            <ListItemAvatar className="list-item-avatar">
              {renderAvatar()}
            </ListItemAvatar>
          ) : null}
          {startIcon}
          {primaryText || secondaryText ? (
            <ListItemText
              primary={primaryText?.title}
              secondary={secondaryText?.title}
              primaryTypographyProps={
                primaryText?.className
                  ? { className: primaryText?.className }
                  : {}
              }
            />
          ) : null}
          {endIcon}
        </MuiListItemButton>
      </ListItemButtonStyled>
    );
  },
);

ListItemButton.displayName = 'ListItemButton';

export default ListItemButton;
