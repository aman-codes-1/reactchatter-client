import { createContext, useLayoutEffect, useState } from 'react';
import { AuthProviderProps, Context } from './IAuth';
import { useApi, useSocket } from '../../hooks';
import { apiRoutes } from '../../helpers';
import { BaseProtected } from '../../pages';

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
  const [isLoading, setIsLoading] = useState(!!isAuthenticated);
  const [reRun, setReRun] = useState(false);
  const { socket } = useSocket();
  const { callApi, callLogout } = useApi();

  useLayoutEffect(() => {
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
    if (!auth && !!isAuthenticated) {
      verifyLogin();
    }
  }, [auth, isAuthenticated, socket, reRun]);

  const refetch = () => {
    setReRun((prev) => !prev);
  };

  if (isLoading) {
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
