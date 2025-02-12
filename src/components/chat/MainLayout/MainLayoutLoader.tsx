import { List, Skeleton } from '@mui/material';
import { ListItem } from '../..';
import { MainLayoutLoaderStyled } from './MainLayout.styled';

const MainLayoutLoader = ({
  dense = false,
  disablePadding = false,
  disableGutters = false,
  dataCount = 1,
  sx,
  avatarClassName,
  disablePrimary,
  disableSecondary,
  primaryFontSize,
  secondaryFontSize,
  btnAlignItems,
  btnClassName,
  listClassName,
  listItemTextClassName,
}: any) => {
  const data = Array.from({ length: dataCount || 1 }, (_, idx) => idx + 1);

  return (
    <MainLayoutLoaderStyled>
      <List
        dense={dense}
        disablePadding
        className={listClassName}
        sx={{ overflow: 'auto' }}
      >
        {data?.map((item: number, idx: number) => (
          <ListItem
            key={item}
            disableHover
            disablePadding={disablePadding}
            disableGutters
            sx={sx}
            btnProps={{
              disableGutters,
              className: btnClassName,
              alignItems: btnAlignItems,
              textProps: {
                ...(disablePrimary
                  ? {}
                  : {
                      primary: <Skeleton className="primary-skeleton" />,
                      slotProps: {
                        primary: {
                          fontSize: primaryFontSize || '1rem',
                        },
                      },
                    }),
                ...(disableSecondary
                  ? {}
                  : {
                      secondary: <Skeleton className="secondary-skeleton" />,
                      slotProps: {
                        secondary: {
                          fontSize: secondaryFontSize || '0.875rem',
                        },
                      },
                    }),
                className: listItemTextClassName,
              },
              avatarProps: {
                children: (
                  <Skeleton
                    variant="circular"
                    className={avatarClassName || 'avatar-skeleton'}
                  />
                ),
              },
            }}
          />
        ))}
      </List>
    </MainLayoutLoaderStyled>
  );
};

export default MainLayoutLoader;
