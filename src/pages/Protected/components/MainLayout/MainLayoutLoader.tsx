import { Skeleton } from '@mui/material';
import { MainLayoutLoaderStyled } from './MainLayout.styled';
import { Avatar } from '../../../../components';

const MainLayoutLoader = ({ defaultText, children }: any) => (
  <MainLayoutLoaderStyled>
    <Skeleton width={370} height={100} />
    {defaultText ? (
      <Skeleton width={270} height={30} className="skeleton-default-text" />
    ) : null}
    {children}
    <div style={{ marginTop: 7 }} className="sent-requests-wrapper">
      <div className="sent-requests-email-wrapper">
        <Skeleton variant="circular">
          <Avatar width={24} height={24} />
        </Skeleton>
        <Skeleton width={200} />
      </div>
      {/* <div className="sent-requests-btn-wrapper">
        {isAcceptBtn ? (
          <Skeleton sx={{ mr: '0.875rem' }} variant="circular">
            <Avatar width={32} height={32} />
          </Skeleton>
        ) : null}
        {isCancelBtn ? (
          <Skeleton sx={{ mr: '0.5rem' }} variant="circular">
            <Avatar width={32} height={32} />
          </Skeleton>
        ) : null}
      </div> */}
    </div>
  </MainLayoutLoaderStyled>
);

export default MainLayoutLoader;
