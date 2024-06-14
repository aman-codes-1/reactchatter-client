import { createContext, useContext, useLayoutEffect, useState } from 'react';
import { AuthProviderProps, Context } from './IAuth';
import { useApi, useSocket } from '../../hooks';
import { apiRoutes } from '../../helpers';
import { ConnectionContext } from '..';
import { BaseProtected } from '../../pages';

export const AuthContext = createContext<Context>({
  auth: {},
  setAuth: () => null,
  refetch: () => null,
  isLoading: false,
  isLogout: false,
  setIsLogout: () => null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState();
  const [reRun, setReRun] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const { socket } = useSocket();
  const { callApi, logout } = useApi();
  const { isLoading: isConnectionLoading, isAuthLoading } =
    useContext(ConnectionContext);
  const [isLoading, setIsLoading] = useState(isAuthLoading);

  useLayoutEffect(() => {
    const verifyLogin = async () => {
      setIsLoading(true);
      try {
        const { data }: any = await callApi({
          url: apiRoutes.AuthProfile,
          withCredentials: true,
        });
        localStorage.setItem('isAuthenticated', 'true');
        setAuth({
          isLoggedIn: true,
          ...data?.data,
        });
      } catch (err: any) {
        await logout();
        setIsLogout(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (!auth && !isLogout) {
      if (isConnectionLoading) return;
      verifyLogin();
    }
  }, [auth, isLogout, isConnectionLoading, socket, reRun]);

  const refetch = () => {
    setReRun((prev) => !prev);
  };

  if (isLoading && isAuthLoading && !isLogout) {
    return <BaseProtected />;
  }

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, refetch, isLoading, isLogout, setIsLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
