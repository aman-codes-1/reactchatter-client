import { gql } from '@apollo/client';

const CHATS_QUERY = gql`
  query chats($friendId: String!) {
    chats(chatData: { friendId: $friendId }) {
      _id
      friendId
      message
      receiver {
        _id
        deliveredStatus {
          isDelivered
          timestamp
        }
        readStatus {
          isRead
          timestamp
        }
      }
      sender {
        _id
        sentStatus {
          isSent
          timestamp
        }
      }
    }
  }
`;

const CHAT_ADDED_SUBSCRIPTION = gql`
  subscription OnChatAdded {
    OnChatAdded {
      friendId
      data {
        _id
        friendId
        message
        receiver {
          _id
          deliveredStatus {
            isDelivered
            timestamp
          }
          readStatus {
            isRead
            timestamp
          }
        }
        sender {
          _id
          sentStatus {
            isSent
            timestamp
          }
        }
      }
    }
  }
`;

const CHATS_ADDED_SUBSCRIPTION = gql`
  subscription OnChatsAdded {
    OnChatsAdded {
      friendId
      data {
        _id
        friendId
        message
        receiver {
          _id
          deliveredStatus {
            isDelivered
            timestamp
          }
          readStatus {
            isRead
            timestamp
          }
        }
        sender {
          _id
          sentStatus {
            isSent
            timestamp
          }
        }
      }
    }
  }
`;

const CHAT_UPDATED_SUBSCRIPTION = gql`
  subscription OnChatUpdated {
    OnChatUpdated {
      friendId
      data {
        _id
        friendId
        message
        receiver {
          _id
          deliveredStatus {
            isDelivered
            timestamp
          }
          readStatus {
            isRead
            timestamp
          }
        }
        sender {
          _id
          sentStatus {
            isSent
            timestamp
          }
        }
      }
    }
  }
`;

const CHATS_UPDATED_SUBSCRIPTION = gql`
  subscription OnChatsUpdated {
    OnChatsUpdated {
      friendId
      data {
        _id
        friendId
        message
        receiver {
          _id
          deliveredStatus {
            isDelivered
            timestamp
          }
          readStatus {
            isRead
            timestamp
          }
        }
        sender {
          _id
          sentStatus {
            isSent
            timestamp
          }
        }
      }
    }
  }
`;

const CREATE_CHAT_MUTATION = gql`
  mutation createChat(
    $friendId: String!
    $message: String!
    $senderId: String!
    $isSent: Boolean!
    $sentTimestamp: Float!
    $receiverId: String!
  ) {
    createChat(
      chatData: {
        friendId: $friendId
        message: $message
        sender: {
          _id: $senderId
          sentStatus: { isSent: $isSent, timestamp: $sentTimestamp }
        }
        receiver: { _id: $receiverId }
      }
      limit: 25
      skip: 0
    ) {
      _id
    }
  }
`;

const UPDATE_CHAT_MUTATION = gql`
  mutation updateChat(
    $friendId: String!
    $message: String!
    $senderId: String!
    $isSent: Boolean!
    $sentTimestamp: Float!
    $receiverId: String!
  ) {
    updateChat(
      chatData: {
        friendId: $friendId
        message: $message
        sender: {
          _id: $senderId
          sentStatus: { isSent: $isSent, timestamp: $sentTimestamp }
        }
        receiver: { _id: $receiverId }
      }
      limit: 25
      skip: 0
    ) {
      _id
    }
  }
`;

export {
  CHATS_QUERY,
  CHAT_ADDED_SUBSCRIPTION,
  CHATS_ADDED_SUBSCRIPTION,
  CHAT_UPDATED_SUBSCRIPTION,
  CHATS_UPDATED_SUBSCRIPTION,
  CREATE_CHAT_MUTATION,
  UPDATE_CHAT_MUTATION,
};
