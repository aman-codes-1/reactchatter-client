import { ReactNode } from 'react';

export type IRouteConfig = {
  Element: () => JSX.Element;
  key: string;
  type: string;
  path: string;
};

export type IAppRoute = {
  defaultRoutes: ReactNode;
  routes: ReactNode;
};
