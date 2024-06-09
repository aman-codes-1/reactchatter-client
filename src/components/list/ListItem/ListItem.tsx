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
      listItemIcon,
      isAvatar = false,
      picture = '',
      width = '',
      padding = '',
      minHeight = '',
      avatarWidth = 0,
      avatarHeight = 0,
      disableHover = false,
      disabled = false,
      secondaryAction,
      dense = false,
      selected = false,
      onClick,
      btnSx,
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
        padding={padding}
        minHeight={minHeight}
        disableHover={disableHover}
        primaryTextFontSize={primaryText?.fontSize}
        primaryTextFontWeight={primaryText?.fontWeight}
        secondaryTextFontSize={secondaryText?.fontSize}
        secondaryTextFontWeight={secondaryText?.fontWeight}
        ellipsesLineClamp={secondaryText?.ellipsesLineClamp}
      >
        <MuiListItem disablePadding secondaryAction={secondaryAction}>
          <ListItemButton
            disableRipple={disableHover}
            disableTouchRipple={disableHover}
            selected={selected}
            className="list-item-btn"
            onClick={onClick}
            disabled={disabled}
            sx={btnSx}
            ref={ref}
            dense={dense}
          >
            {children}
            {isAvatar && (picture || name) ? (
              <ListItemAvatar className="list-item-avatar">
                {renderAvatar()}
              </ListItemAvatar>
            ) : null}
            {listItemIcon}
            {primaryText || secondaryText ? (
              <ListItemText
                primary={primaryText?.title}
                secondary={secondaryText?.title}
              />
            ) : null}
          </ListItemButton>
        </MuiListItem>
      </ListItemStyled>
    );
  },
);

export default ListItem;
