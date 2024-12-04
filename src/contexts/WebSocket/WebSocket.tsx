import { createContext, useEffect, useLayoutEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getOnlineStatus } from '../../helpers';
import { useAuth } from '../../hooks';

export const WebSocketContext = createContext<any>({});

export const WebSocketProvider = ({ children }: any) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { auth, setAuth } = useAuth();

  useLayoutEffect(() => {
    const updateOnlineStatus = (isOnline: boolean) => {
      setAuth((prev: any) => ({
        ...prev,
        onlineStatus: getOnlineStatus(isOnline),
      }));
    };

    const handleVisibilityChange = () => {
      const isTabVisible = document.visibilityState === 'visible';
      updateOnlineStatus(isTabVisible);
    };

    const handleOnline = () => updateOnlineStatus(true);
    const handleOffline = () => updateOnlineStatus(false);

    const eventListeners: {
      target: Window | Document;
      event: string;
      handler: () => void;
    }[] = [
      { target: window, event: 'online', handler: handleOnline },
      { target: window, event: 'blur', handler: handleOffline },
      { target: window, event: 'focus', handler: handleOnline },
      {
        target: document,
        event: 'visibilitychange',
        handler: handleVisibilityChange,
      },
    ];

    eventListeners.forEach(({ target, event, handler }) =>
      target.addEventListener(event, handler),
    );

    handleOnline();

    return () => {
      eventListeners.forEach(({ target, event, handler }) =>
        target.removeEventListener(event, handler),
      );
      handleOffline();
    };
  }, []);

  useEffect(() => {
    let socketInstance: Socket | null = null;
    let isMounted = true;

    const initializeSocket = async () => {
      const serverUri = `${process.env.REACT_APP_PROXY_URI}`;
      if (!serverUri) {
        console.error('Missing REACT_APP_PROXY_URI environment variable');
        return;
      }

      socketInstance = io(serverUri, {
        auth,
        transports: ['websocket'],
      });

      socketInstance.on('connect', () => {
        if (isMounted) {
          setSocket(socketInstance);
          socketInstance?.emit('updateUserOnlineStatus', auth);
        }
      });

      socketInstance.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        if (isMounted) {
          setSocket(null);
        }
      });

      socketInstance.on('disconnect', () => {
        if (isMounted) {
          setSocket(null);
        }
      });
    };

    initializeSocket();

    return () => {
      isMounted = false;
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [auth?.onlineStatus?.isOnline]);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};
