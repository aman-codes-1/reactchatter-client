import { Skeleton } from '@mui/material';
import { MainLayoutStyled } from './MainLayout.styled';

const MainLayoutLoader = ({ children }: any) => (
  <MainLayoutStyled>
    <Skeleton width={350} height={100} className="skeleton" />
    {children}
  </MainLayoutStyled>
);

export default MainLayoutLoader;
