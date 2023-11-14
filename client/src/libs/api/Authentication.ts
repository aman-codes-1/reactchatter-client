import { apiRoutes, callApi } from '../../helpers';

type Auth = {
  token?: string;
};

class Authentication {
  public async loginUser({ token }: Auth) {
    return new Promise((resolve, reject) => {
      callApi({
        method: 'POST',
        url: apiRoutes.AuthLogin,
        data: { token },
      })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public async logoutUser() {
    return new Promise((resolve, reject) => {
      callApi({
        method: 'POST',
        url: apiRoutes.AuthLogout,
        data: {},
      })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          localStorage.removeItem('auth');
          reject(err);
        });
    });
  }
}

export default Authentication;
