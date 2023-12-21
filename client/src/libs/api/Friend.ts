import { apiRoutes, callApi } from '../../helpers';

type Friends = {
  userId?: string;
};

class Friend {
  public async getAllFriends({ userId }: Friends) {
    return new Promise((resolve, reject) => {
      callApi({
        method: 'POST',
        url: apiRoutes.GetAllFriends,
        data: { userId },
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

export default Friend;
