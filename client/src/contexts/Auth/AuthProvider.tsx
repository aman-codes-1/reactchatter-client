import { createContext, useEffect, useState } from 'react';
import { Loader } from '../../components';
import { callApi } from '../../helpers';
import { Auth, AuthProviderProps, Context } from './IAuthProvider';

export const AuthContext = createContext<Context>({
  auth: {},
  setAuth: () => null,
});

export const getLoggedInDetails = (auth: Auth) => {
  const {
    accessToken,
    expiresIn,
    idToken,
    newDeviceMetadata,
    refreshToken,
    tokenType,
    email,
    cognitoId,
  } = auth || {};
  localStorage.setItem(
    'auth',
    JSON.stringify({
      accessToken,
      expiresIn,
      idToken,
      newDeviceMetadata,
      refreshToken,
      tokenType,
      email,
      cognitoId,
    }),
  );
  const userData = {
    ...auth,
    userId: auth?.cognitoId,
    userIdDB: auth?.id || 'no-value',
    permissionArr: auth?.permissions?.length
      ? auth?.permissions?.map(({ objectName }: any) => objectName)
      : [],
  };
  return {
    isLoggedIn: true,
    ...userData,
  };
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const localAuth = localStorage.getItem('auth');
  const localAuthObj = JSON.parse(localAuth || '{}') || {};

  const verifyUser = async () => {
    setAuth(localAuthObj);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!auth && localAuth) {
      setIsLoading(true);
      verifyUser();
    } else {
      setIsLoading(false);
    }
  }, []);

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
