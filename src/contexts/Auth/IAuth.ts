import { ReactElement } from 'react';

export type AuthProviderProps = {
  children: ReactElement;
};

export type Auth = any;

export type Context = {
  auth: Auth;
  setAuth: any;
  refetch: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
};
