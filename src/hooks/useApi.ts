import { useLocation, useNavigate } from 'react-router-dom';
import axios, { AxiosRequestConfig } from 'axios';
import { googleLogout } from '@react-oauth/google';
import { useAuth, useSocket } from '.';
import { apiRoutes } from '../helpers';

export const useApi = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { socket, setUser } = useSocket();
  const { auth, setAuth, setIsLogout } = useAuth();

  const serverUri =
    process.env.NODE_ENV === 'development'
      ? `http://${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}`
      : `${process.env.REACT_APP_URI}`;

  const logout = async () => {
    if (socket) {
      await socket.disconnect();
    }
    setUser();
    localStorage.removeItem('isAuthenticated');
    setAuth(undefined);
    navigate(pathname, { replace: true });
  };

  const callApi = async ({
    method = '',
    url = '',
    data = {},
    headers = {},
    baseURL = '',
    signal = undefined,
    responseType = '',
    withCredentials = false,
  }) => {
    const source = axios.CancelToken.source();
    const options = {
      method: method || 'GET',
      url,
      data,
      baseURL: baseURL || serverUri,
      headers,
      responseType,
      withCredentials,
      ...(signal ? { signal } : {}),
      cancelToken: source.token,
    } as AxiosRequestConfig;
    return new Promise((resolve, reject) => {
      axios(options)
        .then((res: any) => {
          resolve(res);
        })
        .catch(async (err: any) => {
          if (err?.response?.status === 401) {
            await logout();
            setIsLogout(true);
          }
          reject(err);
        });
      setTimeout(() => {
        source.cancel();
      }, 40000);
    }) as any;
  };

  const callLogout = async () => {
    try {
      if (auth?.provider === 'google') {
        googleLogout();
      }
      await callApi({
        url: apiRoutes.AuthLogout,
        withCredentials: true,
      });
    } catch (err: any) {
      //
    } finally {
      await logout();
    }
  };

  return { callApi, callLogout, logout };
};
