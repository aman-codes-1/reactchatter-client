import { ReactNode } from 'react';

export type AuthProviderProps = {
  children: ReactNode;
};

export type Auth = any;

export type Context = {
  auth: Auth;
  setAuth: any;
};
