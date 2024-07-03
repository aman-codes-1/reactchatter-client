import {
  Suspense,
  createContext,
  lazy,
  useLayoutEffect,
  useState,
} from 'react';
import { useApi } from '../../hooks';
import { apiRoutes } from '../../helpers';
import { AuthProviderProps, Context } from './IAuth';
import { BaseProtected } from '../../pages';

export const AuthContext = createContext<Context>({
  auth: {},
  setAuth: () => null,
  isLoading: false,
  setIsLoading: () => null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const isAuthenticated = Boolean(localStorage.getItem('isAuthenticated'));
  const [isLoading, setIsLoading] = useState(isAuthenticated);
  const [auth, setAuth] = useState();
  const { callApi, logout } = useApi();

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
  }, [auth, isAuthenticated]);

  const Routes = lazy(() =>
    import('../../routes').then((module) => ({ default: module.AppRoutes })),
  );

  if (isLoading) {
    return (
      <Suspense fallback={<BaseProtected isLoading={isLoading} />}>
        <Routes isLoading={isLoading} />
      </Suspense>
    );
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
