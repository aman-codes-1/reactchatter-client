import axios from 'axios';

export const callApi = async ({
  method = '',
  url = '',
  data = {},
  headers = {},
  baseURL = '',
  signal = undefined,
  responseType = '',
}) => {
  const options = {
    method,
    url,
    data,
    baseURL: baseURL || process.env.REACT_APP_BACKEND_URI,
    headers,
    responseType,
    ...(signal ? { signal } : {}),
  } as any;
  return new Promise((resolve, reject) => {
    axios(options)
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
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

export const apiRoutes = {
  // Authentication
  AuthLogin: '/auth/login',
  AuthLogout: '/auth/logout',
};
