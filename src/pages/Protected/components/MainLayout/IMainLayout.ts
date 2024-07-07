import { ReactNode } from 'react';

export type MainLayoutProps = {
  heading?: string;
  defaultText?: string;
  loading?: boolean;
  data?: any;
  error?: string;
  loaderProps?: any;
  onlyChildren?: boolean;
  children?: ReactNode;
};
