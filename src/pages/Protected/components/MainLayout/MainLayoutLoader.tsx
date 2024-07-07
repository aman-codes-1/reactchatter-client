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
          title: <Skeleton width={160} />,
          fontSize: '1.08rem',
        }}
        secondaryText={{
          title: <Skeleton width={250} />,
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
