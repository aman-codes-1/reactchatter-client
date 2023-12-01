import { Typography } from '@mui/material';
import { MainLayoutStyled } from './MainLayout.styled';
import { MainLayoutProps } from './IMainLayout';

const MainLayout = ({ heading, defaultText, children }: MainLayoutProps) => (
  <MainLayoutStyled>
    <Typography
      className="main-layout-heading"
      fontFamily="unset"
      fontWeight={700}
    >
      {heading}
    </Typography>
    {defaultText && (
      <Typography
        className="main-layout-default-text"
        fontFamily="unset"
        fontWeight={500}
      >
        {defaultText}
      </Typography>
    )}
    {children}
  </MainLayoutStyled>
);

export default MainLayout;
