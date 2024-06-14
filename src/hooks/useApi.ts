import { useNavigate } from 'react-router-dom';
import axios, { AxiosRequestConfig } from 'axios';
import { googleLogout } from '@react-oauth/google';
import { Dispatch, SetStateAction } from 'react';
import { useAuth, useSocket } from '.';
import { apiRoutes } from '../helpers';

export const useApi = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { auth, setAuth } = useAuth();

  const serverUri =
    process.env.NODE_ENV === 'development'
      ? `http://${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}`
      : `${process.env.REACT_APP_URI}`;

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setAuth(undefined);
    navigate('/', { replace: true });
    if (socket) {
      socket.disconnect();
    }
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
        .catch((err: any) => {
          if (err?.response?.data?.message === 'Unauthorized') {
            logout();
          }
          reject(err);
        });
      setTimeout(() => {
        source.cancel();
      }, 40000);
    }) as any;
  };

  const callLogout = async (
    setIsLoading: Dispatch<SetStateAction<boolean>>,
  ) => {
    setIsLoading(true);
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
      logout();
      setIsLoading(false);
    }
  };

  return { callApi, callLogout, logout };
};
