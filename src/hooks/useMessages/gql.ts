import { DocumentNode } from 'graphql';
import { gql } from '../../__generated__/gql';

const MESSAGES_QUERY = gql(/* GraphQL */ `
  query messages($userId: String!, $chatId: String!) {
    messages(input: { userId: $userId, chatId: $chatId }, limit: 25, skip: 0) {
      chatId
      data {
        _id
        chatId
        message
        otherMembers {
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
`) as DocumentNode;

// const CREATE_MESSAGE_MUTATION = gql(/* GraphQL */ `
//   mutation createMessage(
//     $userId: String!
//     $chatId: String!
//     $message: String!
//     $senderId: String!
//     $isSent: Boolean!
//     $sentTimestamp: Float!
//     $receiverId: String!
//   ) {
//     createMessage(
//       input: {
//         chatId: $chatId
//         message: $message
//         sender: {
//           _id: $senderId
//           sentStatus: { isSent: $isSent, timestamp: $sentTimestamp }
//         }
//         receiver: { _id: $receiverId }
//       }
//       limit: 25
//       skip: 0
//     ) {
//       userId
//       data {
//         _id
//       }
//     }
//   }
// `);

// const UPDATE_MESSAGE_MUTATION = gql(/* GraphQL */ `
//   mutation updateChat(
//     $userId: String!
//     $chatId: String!
//     $message: String!
//     $senderId: String!
//     $isSent: Boolean!
//     $sentTimestamp: Float!
//     $receiverId: String!
//   ) {
//     updateChat(
//       chatData: {
//         chatId: $chatId
//         message: $message
//         sender: {
//           _id: $senderId
//           sentStatus: { isSent: $isSent, timestamp: $sentTimestamp }
//         }
//         receiver: { _id: $receiverId }
//       }
//       limit: 25
//       skip: 0
//     ) {
//       userId
//       data {
//         _id
//       }
//     }
//   }
// `);

const MESSAGE_ADDED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnMessageAdded {
    OnMessageAdded {
      chatId
      data {
        _id
        chatId
        message
        otherMembers {
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
`) as DocumentNode;

const MESSAGES_ADDED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnMessagesAdded {
    OnMessagesAdded {
      chatId
      data {
        _id
        chatId
        message
        otherMembers {
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
`) as DocumentNode;

const MESSAGE_UPDATED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnMessageUpdated {
    OnMessageUpdated {
      chatId
      data {
        _id
        chatId
        message
        otherMembers {
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
`) as DocumentNode;

const MESSAGES_UPDATED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnMessagesUpdated {
    OnMessagesUpdated {
      chatId
      data {
        _id
        chatId
        message
        otherMembers {
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
`) as DocumentNode;

export {
  MESSAGES_QUERY,
  // CREATE_MESSAGE_MUTATION,
  // UPDATE_MESSAGE_MUTATION,
  MESSAGE_ADDED_SUBSCRIPTION,
  MESSAGES_ADDED_SUBSCRIPTION,
  MESSAGE_UPDATED_SUBSCRIPTION,
  MESSAGES_UPDATED_SUBSCRIPTION,
};
