import { forwardRef } from 'react';
import {
  ListItem as MuiListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import { Avatar } from '../..';
import { ListItemProps } from './IListItem';
import { ListItemStyled } from './ListItem.styled';

const ListItem = forwardRef(
  (
    {
      primaryText,
      secondaryText,
      avatar,
      startIcon,
      endIcon,
      width = '',
      btnHeight = '',
      disableGutters = false,
      disablePadding = false,
      denseListItem = false,
      denseListItemButton = false,
      disableHover = false,
      disabled = false,
      secondaryAction,
      selected = false,
      onClick,
      sx,
      className,
      children,
    }: ListItemProps,
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
      <ListItemStyled
        width={width}
        disableHover={disableHover}
        primaryTextFontSize={primaryText?.fontSize}
        primaryTextFontWeight={primaryText?.fontWeight}
        primaryEllipsesLineClamp={primaryText?.ellipsesLineClamp}
        secondaryTextFontSize={secondaryText?.fontSize}
        secondaryTextFontWeight={secondaryText?.fontWeight}
        secondaryEllipsesLineClamp={secondaryText?.ellipsesLineClamp}
        btnHeight={btnHeight}
        className={className}
      >
        <MuiListItem
          dense={denseListItem}
          disableGutters={disableGutters}
          disablePadding={disablePadding}
          secondaryAction={secondaryAction}
        >
          <ListItemButton
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
          </ListItemButton>
        </MuiListItem>
      </ListItemStyled>
    );
  },
);

ListItem.displayName = 'ListItem';

export default ListItem;
