import { createContext, useLayoutEffect, useMemo, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useAuth } from '../../hooks';
import { createApolloClient } from './createApolloClient';
import { io } from 'socket.io-client';

export const WebSocketContext = createContext<any>({});

export const WebSocketProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>();
  const [socket, setSocket] = useState<any>(null);
  const { auth = {} } = useAuth();

  const client: any = useMemo(() => {
    if (auth?.isLoggedIn) {
      return createApolloClient(auth);
    }
  }, [auth]);

  useLayoutEffect(() => {
    if (client) {
      const userOnlineStatus = (status: boolean) => ({
        ...client?.auth,
        isOnline: status,
      });
      setUser(userOnlineStatus(true));
      const onWindowBlur = () => {
        setUser(userOnlineStatus(false));
      };
      const onWindowFocus = () => {
        setUser(userOnlineStatus(true));
      };
      const onVisibilityChange = () => {
        const isTabVisible =
          document.visibilityState === 'visible' ? true : false;
        setUser(userOnlineStatus(isTabVisible));
      };
      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('blur', onWindowBlur);
      window.addEventListener('focus', onWindowFocus);
      return () => {
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('blur', onWindowBlur);
        window.removeEventListener('focus', onWindowFocus);
      };
    }
  }, [client]);

  useLayoutEffect(() => {
    if (user) {
      const socket = io(`${process.env.REACT_APP_BACKEND_URI}`, {
        auth: user,
      });
      const initializeSocket = async () => {
        const socketPromise = new Promise((resolve, reject) => {
          socket.once('connect', () => {
            resolve(socket);
          });
          socket.once('connect_error', (error) => {
            console.error('Socket connection error:', error);
            reject(error);
          });
        });
        try {
          const socket = await socketPromise;
          setSocket(socket);
        } catch (error) {
          console.error('Error establishing socket connection:', error);
        }
      };

      initializeSocket();

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [user]);

  return (
    <WebSocketContext.Provider value={{ socket, setUser }}>
      {client ? (
        <ApolloProvider client={client?.client}>{children}</ApolloProvider>
      ) : (
        children
      )}
    </WebSocketContext.Provider>
  );
};
