import { Typography } from '@mui/material';
import { MainLayoutStyled } from './MainLayout.styled';
import { MainLayoutProps } from './IMainLayout';
import { SuccessErrorMessage } from '../../../../../components';

const MainLayout = ({
  heading,
  defaultText,
  loading,
  data,
  error,
  children,
}: MainLayoutProps) => (
  <MainLayoutStyled>
    <Typography
      className="main-layout-heading"
      fontFamily="unset"
      fontWeight={700}
    >
      {heading}
    </Typography>
    {defaultText && !loading && !error && !data?.length ? (
      <Typography
        className="main-layout-default-text"
        fontFamily="unset"
        fontWeight={500}
      >
        {defaultText}
      </Typography>
    ) : null}
    {error ? <SuccessErrorMessage message={error} type="error" /> : null}
    {children}
  </MainLayoutStyled>
);

export default MainLayout;
