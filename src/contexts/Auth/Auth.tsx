import { createContext, useContext, useLayoutEffect, useState } from 'react';
import { AuthProviderProps, Context } from './IAuth';
import { useApi } from '../../hooks';
import { apiRoutes } from '../../helpers';
import { ConnectionContext } from '..';
import { BaseProtected } from '../../pages';

export const AuthContext = createContext<Context>({
  auth: {},
  setAuth: () => null,
  refetch: () => null,
  isLoading: false,
  setIsLoading: () => null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState();
  const [reRun, setReRun] = useState(false);
  const { callApi, logout } = useApi();
  const { isAuthenticated } = useContext(ConnectionContext);
  const [isLoading, setIsLoading] = useState(isAuthenticated);

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
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    if (!auth && isAuthenticated) {
      verifyLogin();
    } else {
      setIsLoading(false);
    }
  }, [auth, reRun]);

  const refetch = () => {
    setReRun((prev) => !prev);
  };

  if (isLoading) {
    return <BaseProtected isLoading={isLoading} />;
  }

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, refetch, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
