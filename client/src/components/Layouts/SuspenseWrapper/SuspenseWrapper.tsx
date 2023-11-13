import { lazy, Suspense } from 'react';
import { Loader } from '../..';
import { SuspenseWrapperProps } from './ISuspense';

const SuspenseWrapper = (props: SuspenseWrapperProps) => {
  const { path, compName, loaderHeight } = props;
  const LazyComponent = lazy(() => import(`../../../${path}`).then((module: any) => ({
    default: compName ? module[compName] : module,
  })));

  return (
    <Suspense fallback={<Loader center={!loaderHeight} height={loaderHeight} />}>
      <LazyComponent />
    </Suspense>
  );
};

export default SuspenseWrapper;
