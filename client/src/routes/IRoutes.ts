import { ReactNode } from 'react';

export type IRouteConfig = {
  key: string;
  type: string;
  path: string;
  visibility: boolean;
  Element: () => JSX.Element;
};

export type IPublicRoute = {
  publicRoutes: ReactNode;
  defaultRoutes: ReactNode;
}

export type IPrivateRoute = {
  privateRoutes: ReactNode;
  defaultRoutes: ReactNode;
}
