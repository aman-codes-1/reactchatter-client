import { useEffect, useState } from 'react';

export const useNavigatorOnLine = () => {
  const [url, setUrl] = useState('https://www.google.com/');
  const [urlPoll, setUrlPoll] = useState(10000);
  const [urlTimeout, setUrlTimeout] = useState(5000);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let controllerTimeout: any = 0;
    const fetchRequest = async () => {
      const controller = new AbortController();
      controllerTimeout = setTimeout(() => controller.abort(), urlTimeout);
      setIsLoading(true);
      try {
        await fetch(url, {
          mode: 'no-cors',
          signal: controller.signal,
        });
        setIsOffline(false);
        setIsLoading(false);
        clearTimeout(controllerTimeout);
      } catch (err) {
        setIsOffline(true);
        setIsLoading(false);
        clearTimeout(controllerTimeout);
      }
    };

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
    isLoading,
    isOffline,
  };
};
