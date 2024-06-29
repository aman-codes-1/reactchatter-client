import { useLayoutEffect, useRef, useState } from 'react';

export const useNavigatorOnLine = () => {
  const url = 'https://www.google.com';
  const urlPoll = 10000;
  const urlTimeout = 5000;
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const hasFetched = useRef(false);

  useLayoutEffect(() => {
    let controllerTimeout: any = 0;
    const fetchRequest = async () => {
      const controller = new AbortController();
      controllerTimeout = setTimeout(() => controller.abort(), urlTimeout);
      setIsLoading(true);
      setIsOffline(false);
      try {
        await fetch(url, {
          ...(process.env.NODE_ENV === 'development'
            ? { mode: 'no-cors' }
            : {}),
          signal: controller.signal,
        });
        setIsOffline(false);
      } catch (err) {
        setIsOffline(true);
      } finally {
        setIsLoading(false);
        clearTimeout(controllerTimeout);
      }
    };

    if (hasFetched.current) return;

    let interval: any;
    if (isOffline) {
      interval = setInterval(() => {
        if (document.visibilityState !== 'visible') return;
        fetchRequest();
      }, urlPoll);
    } else {
      fetchRequest();
    }

    window.addEventListener('online', fetchRequest);
    window.addEventListener('offline', fetchRequest);

    hasFetched.current = true;

    return () => {
      window.removeEventListener('online', fetchRequest);
      window.removeEventListener('offline', fetchRequest);
      clearTimeout(controllerTimeout);
      if (isOffline) {
        clearInterval(interval);
      }
    };
  }, [isOffline, url, urlPoll, urlTimeout]);

  return {
    isLoading: !!isLoading,
    isOffline: !!isOffline,
  };
};
