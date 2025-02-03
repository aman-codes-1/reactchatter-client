import { useContext } from 'react';
import { Typography } from '@mui/material';
import { MainLayoutLoader, SuccessErrorMessage } from '../..';
import { DrawerContext } from '../../../contexts';
import { MainLayoutProps } from './IMainLayout';
import { MainLayoutStyled } from './MainLayout.styled';

const MainLayout = ({
  heading,
  defaultText,
  loading = false,
  loaderProps,
  disableLoader = false,
  data,
  error,
  onlyChildren = false,
  children,
}: MainLayoutProps) => {
  const { navbarHeight } = useContext(DrawerContext);
  const isLoading = loading && !disableLoader;

  return (
    <MainLayoutStyled navbarHeight={navbarHeight}>
      {heading ? (
        <Typography className="main-layout-heading" fontWeight={700}>
          {heading}
        </Typography>
      ) : null}
      {isLoading ? <MainLayoutLoader {...loaderProps} dataCount={5} /> : null}
      {!isLoading && !error && !data?.length && defaultText?.length ? (
        <Typography className="main-layout-default-text" fontWeight={500}>
          {defaultText}
        </Typography>
      ) : null}
      {!isLoading && error ? (
        <SuccessErrorMessage message={error} type="error" />
      ) : null}
      {!isLoading && !error && (data?.length || onlyChildren) ? children : null}
    </MainLayoutStyled>
  );
};

export default MainLayout;
