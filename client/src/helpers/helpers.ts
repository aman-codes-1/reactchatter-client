import axios, { AxiosRequestConfig } from 'axios';

export const callApi = async ({
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
    method,
    url,
    data,
    baseURL: baseURL || process.env.REACT_APP_BACKEND_URI,
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
        reject(err);
      });
    setTimeout(() => {
      source.cancel();
    }, 10000);
  }) as any;
};

export const formatDate = (dateValue: string | number | Date) => {
  const date = new Date(dateValue);
  return date
    .toLocaleString([], {
      dateStyle: 'short',
      timeStyle: 'short',
      hour12: true,
    })
    .replace(/,/g, '')
    .trim();
};

export const getCurrentYear = () => new Date().getFullYear();

export const checkIfImageExists = (url: string, callback: (exists: boolean) => void) => {
  const img = new Image();
  img.src = url || 'undefined';

  if (img.complete) {
    callback(true);
  } else {
    img.onload = () => {
      callback(true);
    };

    img.onerror = () => {
      callback(false);
    };
  }
};

export const apiRoutes = {
  // Authentication
  AuthGoogleLogin: '/auth/google',
  AuthGoogleVerifyToken: '/auth/google/verifyToken',
  AuthGoogleLogout: '/auth/google/logout',
};
