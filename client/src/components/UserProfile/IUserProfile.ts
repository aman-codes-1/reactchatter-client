import { ReactNode } from 'react';

export type UserProfileProps = {
  picture: string;
  name: string;
  email?: string;
  padding?: string;
  avatarWidth?: number;
  avatarHeight?: number;
  disableHover?: boolean;
  secondaryAction?: ReactNode;
  dense?: boolean;
};
