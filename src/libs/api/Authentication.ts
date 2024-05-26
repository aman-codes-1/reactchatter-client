import { apiRoutes, callApi } from '../../helpers';

type Auth = {
  code?: string | null;
};

class Authentication {
  public async profile() {
    return new Promise((resolve, reject) => {
      callApi({
        method: 'GET',
        url: apiRoutes.AuthProfile,
        withCredentials: true,
      })
        .then((data) => {
          resolve(data);
        })
        .catch(async (err) => {
          reject(err);
        });
    });
  }

  public async logout() {
    return new Promise((resolve, reject) => {
      callApi({
        method: 'GET',
        url: apiRoutes.AuthLogout,
        withCredentials: true,
      })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default Authentication;
