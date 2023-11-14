import { apiRoutes, callApi } from '../../helpers';

type Auth = any;

class Authentication {
  public async loginUser({ email = '', password = '', encodedResponse = '' }: Auth) {
    const formData = new FormData();
    formData.append('Email', email);
    formData.append('Password', password);
    formData.append('EncodedResponse', encodedResponse);
    return new Promise((resolve, reject) => {
      callApi({
        method: 'POST',
        url: apiRoutes.AuthLogin,
        data: formData,
      })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public async logoutUser() {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    const formData = new FormData();
    formData.append('AccessToken', auth?.accessToken);
    formData.append('RefreshToken', auth?.refreshToken);
    return new Promise((resolve, reject) => {
      callApi({
        method: 'POST',
        url: apiRoutes.AuthLogout,
        data: formData,
      })
        .then(({ data }) => {
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
