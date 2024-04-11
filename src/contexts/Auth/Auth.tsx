import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { AuthProviderProps, Context } from './IAuth';
import { Loader } from '../../components';
import { Authentication } from '../../libs';
import { useSocket } from '../../hooks';

export const AuthContext = createContext<Context>({
  auth: {},
  setAuth: () => null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState();
  const isGoogle = Boolean(localStorage.getItem('isGoogle'));
  const [isLoading, setIsLoading] = useState(isGoogle ? true : false);
  const { socket } = useSocket();

  useEffect(() => {
    const authentication = new Authentication();
    const verifyLogin = async () => {
      setIsLoading(true);
      try {
        const { data }: any = await authentication.googleVerifyToken();
        setAuth({
          isLoggedIn: true,
          ...data?.data,
        });
        setIsLoading(false);
      } catch (err: any) {
        googleLogout();
        await authentication.googleLogout();
        localStorage.removeItem('isGoogle');
        setAuth(undefined);
        navigate('/', { replace: true });
        if (socket) {
          socket.disconnect();
        }
        setIsLoading(false);
      }
    };
    if (!auth && isGoogle === true) {
      verifyLogin();
    }
  }, [auth, isGoogle, navigate, socket]);

  if (isLoading) {
    return <Loader center />;
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
