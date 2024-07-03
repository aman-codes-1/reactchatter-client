import { Typography } from '@mui/material';
import { Loader, SuccessErrorMessage } from '../../../../components';
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
  return (
    <MainLayoutStyled>
      {heading ? (
        <Typography className="main-layout-heading" fontWeight={700}>
          {heading}
        </Typography>
      ) : null}
      {loading ? <Loader center /> : null}
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
