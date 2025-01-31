import {
  ReactElement,
  createContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export const ConnectionContext = createContext<any>({});

export const ConnectionProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const isInitialLoad = useRef(true);

  useLayoutEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (!isInitialLoad?.current && navigator?.onLine && document.hasFocus()) {
        window.location.reload();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    isInitialLoad.current = false;

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ConnectionContext.Provider value={{ isOnline }}>
      {children}
    </ConnectionContext.Provider>
  );
};
