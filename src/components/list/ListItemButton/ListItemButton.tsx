import { forwardRef } from 'react';
import {
  ListItemAvatar,
  ListItemButton as MuiListItemButton,
  ListItemText,
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
      alignItems = 'center',
      denseListItemButton = false,
      disabled,
      selected,
      onClick,
      sx,
      listItemTextSx,
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

      const nameFirstLetter = name?.length
        ? name?.substring(0, 1).toUpperCase()
        : null;

      return (
        <Avatar
          alt={nameFirstLetter}
          src=""
          width={avatar?.width}
          height={avatar?.height}
        >
          {nameFirstLetter}
        </Avatar>
      );
    };

    return (
      <ListItemButtonStyled
        width={width}
        btnHeight={btnHeight}
        variant={variant}
        disableHover={disableHover}
        primaryTextMarginTop={primaryText?.marginTop}
        primaryTextFontSize={primaryText?.fontSize}
        primaryTextFontWeight={primaryText?.fontWeight}
        primaryEllipsesLineClamp={primaryText?.ellipsesLineClamp}
        secondaryTextMarginTop={secondaryText?.marginTop}
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
          alignItems={alignItems}
        >
          {isAvatar ? (
            <ListItemAvatar>{avatar?.comp || renderAvatar()}</ListItemAvatar>
          ) : null}
          {}
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
              sx={listItemTextSx}
            />
          ) : null}
          {endIcon}
          {children}
        </MuiListItemButton>
      </ListItemButtonStyled>
    );
  },
);

ListItemButton.displayName = 'ListItemButton';

export default ListItemButton;
