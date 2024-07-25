import { List, Skeleton } from '@mui/material';
import { ListItem } from '../../../../components';
import { MainLayoutLoaderStyled } from './MainLayout.styled';

const MainLayoutLoader = ({
  avatarWidth,
  avatarHeight,
  disablePrimary,
  disableSecondary,
  primaryFontSize,
  secondaryFontSize,
  btnHeight,
  sx,
}: any) => (
  <MainLayoutLoaderStyled>
    <List dense disablePadding>
      <ListItem
        disableGutters
        disableHover
        sx={sx}
        avatar={{
          comp: (
            <Skeleton
              variant="circular"
              width={avatarWidth || 42}
              height={avatarHeight || 42}
            />
          ),
        }}
        primaryText={
          disablePrimary
            ? null
            : {
                title: <Skeleton className="primary-skeleton" />,
                fontSize: primaryFontSize || '1.08rem',
              }
        }
        secondaryText={
          disableSecondary
            ? null
            : {
                title: <Skeleton className="secondary-skeleton" />,
                fontSize: secondaryFontSize || '0.85rem',
              }
        }
        btnHeight={btnHeight || '5.1rem'}
      />
    </List>
  </MainLayoutLoaderStyled>
);

export default MainLayoutLoader;
