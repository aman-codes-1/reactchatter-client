import { forwardRef } from 'react';
import {
  ListItem as MuiListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import { Avatar } from '../..';
import { ListItemStyled } from './ListItem.styled';
import { ListItemProps } from './IListItem';

const ListItem = forwardRef(
  (
    {
      primaryText,
      secondaryText,
      startIcon,
      endIcon,
      isAvatar = false,
      picture = '',
      width = '',
      btnHeight = '',
      avatarWidth = 0,
      avatarHeight = 0,
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

    const renderAvatar = () => {
      if (name?.length && picture?.length) {
        return (
          <Avatar
            alt={name}
            src={picture}
            width={avatarWidth}
            height={avatarHeight}
          />
        );
      }
      if (name?.length) {
        return (
          <Avatar width={avatarWidth} height={avatarHeight}>
            {name?.length ? name?.substring(0, 1).toUpperCase() : null}
          </Avatar>
        );
      }
      return <Avatar width={avatarWidth} height={avatarHeight} />;
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
            {isAvatar && (picture || name) ? (
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

export default ListItem;
