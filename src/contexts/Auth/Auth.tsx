import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { AuthProviderProps, Context } from './IAuth';
import { Loader } from '../../components';
import { Authentication } from '../../libs';
import { useSocket } from '../../hooks';
import { ConnectionContext } from '../Connection';

export const AuthContext = createContext<Context>({
  auth: {},
  setAuth: () => null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState();
  const isAuthenticated = Boolean(localStorage.getItem('isAuthenticated'));
  const [isLoading, setIsLoading] = useState(!!isAuthenticated);
  const { socket } = useSocket();
  const { isLoading: isConnectionLoading } = useContext(ConnectionContext);

  useEffect(() => {
    const authentication = new Authentication();
    const verifyLogin = async () => {
      setIsLoading(true);
      try {
        const { data }: any = await authentication.profile();
        setAuth({
          isLoggedIn: true,
          ...data?.data,
        });
        setIsLoading(false);
      } catch (err: any) {
        try {
          googleLogout();
          await authentication.logout();
        } catch (error) {
          //
        }
        localStorage.removeItem('isAuthenticated');
        setAuth(undefined);
        navigate('/', { replace: true });
        if (socket) {
          socket.disconnect();
        }
        setIsLoading(false);
      }
    };
    if (!auth && isAuthenticated === true) {
      if (isConnectionLoading) return;
      verifyLogin();
    }
  }, [auth, isAuthenticated, socket, isConnectionLoading]);

  if (isLoading) {
    return <Loader center />;
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
