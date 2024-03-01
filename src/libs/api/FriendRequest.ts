import { apiRoutes, callApi } from '../../helpers';

type Request = {
  sendToEmail?: string;
  sentByUserId?: string;
  requestId?: string;
  status?: string;
};

class FriendRequest {
  public async sendFriendRequest({ sendToEmail, sentByUserId }: Request) {
    return new Promise((resolve, reject) => {
      callApi({
        method: 'POST',
        url: apiRoutes.SendFriendRequest,
        data: { sendToEmail, sentByUserId },
      })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public async respondToFriendRequest({ requestId, status }: Request) {
    return new Promise((resolve, reject) => {
      callApi({
        method: 'POST',
        url: apiRoutes.RespondToFriendRequest,
        data: { requestId, status },
      })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public async sentFriendRequests({ sentByUserId }: Request) {
    return new Promise((resolve, reject) => {
      callApi({
        method: 'POST',
        url: apiRoutes.SentFriendRequests,
        data: { sentByUserId },
      })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public async receivedFriendRequests({ sentByUserId }: Request) {
    return new Promise((resolve, reject) => {
      callApi({
        method: 'POST',
        url: apiRoutes.ReceivedFriendRequests,
        data: { sentByUserId },
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

export default FriendRequest;
