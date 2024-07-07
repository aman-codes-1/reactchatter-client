import { Typography } from '@mui/material';
import { SuccessErrorMessage } from '../../../../components';
import { useSocket } from '../../../../hooks';
import { MainLayoutLoader } from '.';
import { MainLayoutProps } from './IMainLayout';
import { MainLayoutStyled } from './MainLayout.styled';

const MainLayout = ({
  heading,
  defaultText,
  loading = false,
  data,
  error,
  loaderProps,
  onlyChildren,
  children,
}: MainLayoutProps) => {
  const { isLoading: isSocketLoading } = useSocket();
  const isLoading = loading || isSocketLoading;

  return (
    <MainLayoutStyled>
      {heading ? (
        <Typography className="main-layout-heading" fontWeight={700}>
          {heading}
        </Typography>
      ) : null}
      {isLoading ? <MainLayoutLoader {...loaderProps} /> : null}
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
