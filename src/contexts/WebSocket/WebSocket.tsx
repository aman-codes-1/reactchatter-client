import { createContext, useLayoutEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getOnlineStatus } from '../../helpers';
import { useAuth } from '../../hooks';

export const WebSocketContext = createContext<any>({});

export const WebSocketProvider = ({ children }: any) => {
  const { auth, setAuth } = useAuth();
  const socket = useRef<Socket | null>(null);
  const isHiddenOrBlurredRef = useRef(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const updateOnlineStatus = (isOnline: boolean) => {
    setAuth((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        onlineStatus: getOnlineStatus(isOnline),
      };
    });
  };

  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  const startInactivityTimer = () => {
    clearInactivityTimer();
    inactivityTimerRef.current = setTimeout(() => {
      if (isHiddenOrBlurredRef.current) {
        updateOnlineStatus(false);
      }
    }, 10000);
  };

  const resetInactivity = () => {
    clearInactivityTimer();
    updateOnlineStatus(true);
  };

  useLayoutEffect(() => {
    const handleOnline = () => updateOnlineStatus(true);
    const handleOffline = () => updateOnlineStatus(false);
    const handleInternetOnline = () => updateOnlineStatus(document.hasFocus());

    const handleBlur = () => {
      isHiddenOrBlurredRef.current = true;
      startInactivityTimer();
    };

    const handleFocus = () => {
      isHiddenOrBlurredRef.current = false;
      resetInactivity();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isHiddenOrBlurredRef.current = true;
        startInactivityTimer();
      } else {
        isHiddenOrBlurredRef.current = false;
        resetInactivity();
      }
    };

    handleOnline();

    const eventListeners: {
      target: Window | Document;
      event: string;
      handler: (e?: Event) => void;
    }[] = [
      { target: window, event: 'mousemove', handler: handleOnline },
      { target: window, event: 'keydown', handler: handleOnline },
      { target: window, event: 'blur', handler: handleBlur },
      { target: window, event: 'focus', handler: handleFocus },
      { target: window, event: 'online', handler: handleInternetOnline },
      { target: window, event: 'offline', handler: handleOffline },
      {
        target: document,
        event: 'visibilitychange',
        handler: handleVisibilityChange,
      },
    ];

    eventListeners.forEach(({ target, event, handler }) =>
      target.addEventListener(event, handler),
    );

    return () => {
      eventListeners.forEach(({ target, event, handler }) =>
        target.removeEventListener(event, handler),
      );
      clearInactivityTimer();
      handleOffline();
    };
  }, [auth?.isLoggedIn]);

  useLayoutEffect(() => {
    const serverUri = `${process.env.REACT_APP_PROXY_URI}`;
    if (!serverUri) {
      console.error('Missing REACT_APP_PROXY_URI environment variable');
      return;
    }
    socket.current = io(serverUri, {
      auth,
      transports: ['websocket'],
    });
    socket?.current?.emit('updateUserOnlineStatus', auth);
    return () => {
      if (socket?.current) {
        socket?.current?.disconnect();
      }
    };
  }, [auth?.onlineStatus?.isOnline]);

  return (
    <WebSocketContext.Provider value={{ socket: socket?.current }}>
      {children}
    </WebSocketContext.Provider>
  );
};
