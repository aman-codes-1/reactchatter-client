import { createContext, useContext, useEffect, useState } from 'react';
import { AuthProviderProps, Context } from './IAuth';
import { Loader } from '../../components';
import { useApi, useSocket } from '../../hooks';
import { ConnectionContext } from '../Connection';
import { apiRoutes } from '../../helpers';

export const AuthContext = createContext<Context>({
  auth: {},
  setAuth: () => null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState();
  const isAuthenticated = Boolean(localStorage.getItem('isAuthenticated'));
  const [isLoading, setIsLoading] = useState(!!isAuthenticated);
  const { socket } = useSocket();
  const { isLoading: isConnectionLoading } = useContext(ConnectionContext);
  const { callApi, callLogout } = useApi();

  useEffect(() => {
    const verifyLogin = async () => {
      setIsLoading(true);
      try {
        const { data }: any = await callApi({
          url: apiRoutes.AuthProfile,
          withCredentials: true,
        });
        setAuth({
          isLoggedIn: true,
          ...data?.data,
        });
        setIsLoading(false);
      } catch (err: any) {
        await callLogout(setIsLoading);
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
