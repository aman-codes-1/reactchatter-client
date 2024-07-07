import { List, Skeleton } from '@mui/material';
import { ListItem } from '../../../../components';
import { MainLayoutLoaderStyled } from './MainLayout.styled';

const MainLayoutLoader = () => (
  <MainLayoutLoaderStyled>
    <List dense disablePadding>
      <ListItem
        disableGutters
        disableHover
        primaryText={{
          title: <Skeleton className="primary-skeleton" />,
          fontSize: '1.08rem',
        }}
        secondaryText={{
          title: <Skeleton className="secondary-skeleton" />,
          fontSize: '0.85rem',
        }}
        btnHeight="5.1rem"
      >
        <Skeleton
          variant="circular"
          width={38}
          height={38}
          className="skeleton-avatar"
        />
      </ListItem>
    </List>
  </MainLayoutLoaderStyled>
);

export default MainLayoutLoader;
