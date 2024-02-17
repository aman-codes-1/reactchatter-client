import { lazy, Suspense } from 'react';
import { SuspenseWrapperProps } from './ISuspense';

const SuspenseWrapper = (props: SuspenseWrapperProps) => {
  const { path, compName, fallback } = props;
  const LazyComponent = lazy(() =>
    import(`../../${path}`).then((module: any) => ({
      default: compName ? module[compName] : module,
    })),
  );

  return (
    <Suspense fallback={fallback || null}>
      <LazyComponent />
    </Suspense>
  );
};

export default SuspenseWrapper;
