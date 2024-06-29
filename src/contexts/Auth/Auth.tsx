import { createContext, useEffect, useRef, useState } from 'react';
import { AuthProviderProps, Context } from './IAuth';
import { useApi } from '../../hooks';
import { apiRoutes } from '../../helpers';
import { ConnectionContext } from '..';
import { BaseProtected } from '../../pages';

export const AuthContext = createContext<Context>({
  auth: {},
  setAuth: () => null,
  isLoading: false,
  setIsLoading: () => null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  console.log('inside');
  const [auth, setAuth] = useState();
  const { callApi, logout } = useApi();
  const isAuthenticated = Boolean(localStorage.getItem('isAuthenticated'));
  const [isLoading, setIsLoading] = useState(isAuthenticated);
  const hasVerified = useRef(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
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
        hasVerified.current = true;
      }
    };

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!auth && isAuthenticated && !hasVerified.current) {
      verifyLogin();
    } else {
      setIsLoading(false);
    }
  }, [auth, isAuthenticated]);

  if (isLoading) {
    return <BaseProtected isLoading={isLoading} />;
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
