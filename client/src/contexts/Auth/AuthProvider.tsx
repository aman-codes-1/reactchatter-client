import {
  createContext, useContext, useLayoutEffect, useState,
} from 'react';
import { googleLogout } from '@react-oauth/google';
import { AuthProviderProps, Context } from './IAuthProvider';
import { Loader } from '../../components';
import { SnackbarContext } from '../Snackbar';
import { Authentication } from '../../libs';

export const AuthContext = createContext<Context>({
  auth: {},
  setAuth: () => null,
});

const AuthProvider = ({ children }: AuthProviderProps) => {
  const authentication = new Authentication();
  const [auth, setAuth] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const isGoogle = Boolean(localStorage.getItem('isGoogle'));
  const { openSnackbar } = useContext(SnackbarContext);

  const verifyLogin = async () => {
    setIsLoading(true);
    try {
      const { data }: any = await authentication.googleVerifyToken();
      setAuth({
        isLoggedIn: true,
        ...data?.data,
      });
      setIsLoading(false);
    } catch (err) {
      googleLogout();
      localStorage.removeItem('isGoogle');
      setAuth(undefined);
      window.location.reload();
      openSnackbar({
        message: JSON.stringify(err),
        type: 'error',
      });
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (!auth && isGoogle === true) {
      verifyLogin();
    } else {
      setIsLoading(false);
    }
  }, [auth, isGoogle]);

  if (isLoading) {
    return <Loader center />;
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
