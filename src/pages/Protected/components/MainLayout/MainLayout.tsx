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
  children,
}: MainLayoutProps) => {
  const { isLoading } = useSocket();

  return (
    <MainLayoutStyled>
      {heading ? (
        <Typography className="main-layout-heading" fontWeight={700}>
          {heading}
        </Typography>
      ) : null}
      {loading || isLoading ? <MainLayoutLoader /> : null}
      {defaultText && !loading && !error && !data?.length ? (
        <Typography className="main-layout-default-text" fontWeight={500}>
          {defaultText}
        </Typography>
      ) : null}
      {!loading && error ? (
        <SuccessErrorMessage message={error} type="error" />
      ) : null}
      {children}
    </MainLayoutStyled>
  );
};

export default MainLayout;
