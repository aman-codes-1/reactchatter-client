import { Skeleton } from '@mui/material';
import { MainLayoutLoaderStyled } from './MainLayout.styled';

const MainLayoutLoader = ({ defaultText, children }: any) => (
  <MainLayoutLoaderStyled>
    <Skeleton width={370} height={100} />
    {defaultText ? (
      <Skeleton width={270} height={30} className="skeleton-default-text" />
    ) : null}
    {children}
  </MainLayoutLoaderStyled>
);

export default MainLayoutLoader;
