import { createContext, useContext, useLayoutEffect, useState } from 'react';
import { AuthProviderProps, Context } from './IAuth';
import { useApi, useSocket } from '../../hooks';
import { apiRoutes } from '../../helpers';
import { BaseProtected } from '../../pages';
import { ConnectionContext } from '..';

export const AuthContext = createContext<Context>({
  auth: {},
  setAuth: () => null,
  refetch: () => null,
  isLoading: false,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState();
  const isAuthenticated = Boolean(localStorage.getItem('isAuthenticated'));
  const [isLoading, setIsLoading] = useState(isAuthenticated === true);
  const [reRun, setReRun] = useState(false);
  const { socket } = useSocket();
  const { callApi, callLogout } = useApi();
  const { isLoading: isConnectionLoading } = useContext(ConnectionContext);

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
        setIsLoading(false);
      } catch (err: any) {
        if (err?.response?.status !== 401) {
          await callLogout(setIsLoading);
        } else {
          setIsLoading(false);
        }
      }
    };
    if (!auth) {
      if (isConnectionLoading) return;
      verifyLogin();
    }
  }, [auth, isConnectionLoading, socket, reRun]);

  const refetch = () => {
    setReRun((prev) => !prev);
  };

  if (isLoading && !!isAuthenticated) {
    return <BaseProtected />;
  }

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, refetch, isLoading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
