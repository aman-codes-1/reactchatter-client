import { createContext, useLayoutEffect, useState } from 'react';
import { login } from '../../helpers';
import { AuthProviderProps, Context } from './IAuth';

export const AuthContext = createContext<Context>({
  auth: {},
  setAuth: () => null,
  isWsConnected: false,
  setIsWsConnected: () => null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const token = localStorage.getItem('token');
  const [auth, setAuth] = useState<any>();
  const [isWsConnected, setIsWsConnected] = useState(false);

  useLayoutEffect(() => {
    if (token) {
      login(token, setAuth);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, isWsConnected, setIsWsConnected }}
    >
      {children}
    </AuthContext.Provider>
  );
};
