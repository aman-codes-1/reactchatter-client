import { forwardRef } from 'react';
import { ListItem as MuiListItem } from '@mui/material';
import { ListItemButton } from '..';
import { ListItemProps } from './IListItem';
import { ListItemStyled } from './ListItem.styled';

const ListItem = forwardRef((props: ListItemProps, ref: any) => {
  const {
    width = '',
    btnWidth = '',
    btnClassName = '',
    btnChildren,
    disableHover = false,
    denseListItem = false,
    disableGutters = false,
    disablePadding = false,
    secondaryAction,
    className,
    children,
    ...rest
  } = props;

  return (
    <ListItemStyled
      width={width}
      disableHover={disableHover}
      className={className}
    >
      <MuiListItem
        dense={denseListItem}
        disableGutters={disableGutters}
        disablePadding={disablePadding}
        secondaryAction={secondaryAction}
      >
        <ListItemButton
          width={btnWidth}
          disableHover={disableHover}
          className={btnClassName}
          ref={ref}
          {...rest}
        >
          {btnChildren || null}
        </ListItemButton>
        {children}
      </MuiListItem>
    </ListItemStyled>
  );
});

ListItem.displayName = 'ListItem';

export default ListItem;
