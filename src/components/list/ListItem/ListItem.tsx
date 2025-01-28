import { forwardRef } from 'react';
import { ListItem as MuiListItem } from '@mui/material';
import { ListItemButton } from '..';
import { ListItemProps } from './IListItem';
import { ListItemStyled } from './ListItem.styled';

const ListItem = forwardRef<HTMLDivElement, ListItemProps>((props, ref) => {
  const {
    width = '',
    disableHover = false,
    wrapperClassName,
    btnProps,
    children,
    sx,
    ...rest
  } = props;

  const isListItemButton = !!Object.keys(btnProps || {})?.length;

  return (
    <ListItemStyled
      width={width}
      disableHover={disableHover}
      className={wrapperClassName}
    >
      <MuiListItem {...rest} sx={{ ...sx, cursor: 'default' }}>
        {isListItemButton ? (
          <ListItemButton disableHover={disableHover} ref={ref} {...btnProps} />
        ) : null}
        {children}
      </MuiListItem>
    </ListItemStyled>
  );
});

ListItem.displayName = 'ListItem';

export default ListItem;
