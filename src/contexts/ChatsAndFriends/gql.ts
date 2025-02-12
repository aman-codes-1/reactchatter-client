import { DocumentNode } from 'graphql';
import { gql } from '../../__generated__/gql';

const CACHED_MESSAGES_QUERY = gql(/* GraphQL */ `
  query cachedMessages($chatId: String!) {
    cachedMessages(input: { chatId: $chatId }) {
      edges {
        _id
        chatId
        queueId
        message
        sender {
          _id
          name
          picture
          email
          email_verified
          given_name
          family_name
          retryStatus {
            isRetry
            timestamp
          }
          queuedStatus {
            isQueued
            timestamp
          }
          sentStatus {
            isSent
            timestamp
          }
        }
        receivers {
          _id
          name
          picture
          email
          email_verified
          given_name
          family_name
          deliveredStatus {
            isDelivered
            timestamp
          }
          readStatus {
            isRead
            timestamp
          }
        }
        timestamp
      }
      pageInfo {
        endCursor
        hasPreviousPage
        hasNextPage
      }
      scrollPosition
      isFetched
    }
  }
`) as DocumentNode;

const MESSAGES_QUERY = gql(/* GraphQL */ `
  query messages($chatId: String!, $limit: Int, $after: ID) {
    messages(input: { chatId: $chatId }, limit: $limit, after: $after) {
      edges {
        _id
        chatId
        queueId
        message
        sender {
          _id
          name
          picture
          email
          email_verified
          given_name
          family_name
          retryStatus {
            isRetry
            timestamp
          }
          queuedStatus {
            isQueued
            timestamp
          }
          sentStatus {
            isSent
            timestamp
          }
        }
        receivers {
          _id
          name
          picture
          email
          email_verified
          given_name
          family_name
          deliveredStatus {
            isDelivered
            timestamp
          }
          readStatus {
            isRead
            timestamp
          }
        }
        timestamp
      }
      pageInfo {
        endCursor
        hasPreviousPage
        hasNextPage
      }
      scrollPosition
      isFetched
    }
  }
`) as DocumentNode;

const CREATE_MESSAGE_MUTATION = gql(/* GraphQL */ `
  mutation createMessage(
    $userId: String!
    $chatId: String!
    $queueId: String!
    $isQueued: Boolean!
    $queuedTimestamp: Float!
    $isSent: Boolean!
    $sentTimestamp: Float!
    $message: String!
  ) {
    createMessage(
      input: {
        userId: $userId
        chatId: $chatId
        queueId: $queueId
        isQueued: $isQueued
        queuedTimestamp: $queuedTimestamp
        isSent: $isSent
        sentTimestamp: $sentTimestamp
        message: $message
      }
    ) {
      _id
      queueId
    }
  }
`) as DocumentNode;

const MESSAGE_ADDED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnMessageAdded {
    OnMessageAdded {
      message {
        _id
        chatId
        queueId
        message
        sender {
          _id
          name
          picture
          email
          email_verified
          given_name
          family_name
          retryStatus {
            isRetry
            timestamp
          }
          queuedStatus {
            isQueued
            timestamp
          }
          sentStatus {
            isSent
            timestamp
          }
        }
        receivers {
          _id
          name
          picture
          email
          email_verified
          given_name
          family_name
          deliveredStatus {
            isDelivered
            timestamp
          }
          readStatus {
            isRead
            timestamp
          }
        }
        timestamp
      }
    }
  }
`) as DocumentNode;

const MESSAGE_UPDATED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnMessageUpdated {
    OnMessageUpdated {
      message {
        _id
        chatId
        queueId
        message
        sender {
          _id
          name
          picture
          email
          email_verified
          given_name
          family_name
          retryStatus {
            isRetry
            timestamp
          }
          queuedStatus {
            isQueued
            timestamp
          }
          sentStatus {
            isSent
            timestamp
          }
        }
        receivers {
          _id
          name
          picture
          email
          email_verified
          given_name
          family_name
          deliveredStatus {
            isDelivered
            timestamp
          }
          readStatus {
            isRead
            timestamp
          }
        }
        timestamp
      }
    }
  }
`) as DocumentNode;

const CHAT_QUERY = gql(/* GraphQL */ `
  query chat($chatId: String!) {
    chat(input: { chatId: $chatId }) {
      _id
      type
      members {
        _id
        hasAdded
        name
        picture
        email
        email_verified
        given_name
        family_name
        unreadMessagesCount
      }
      lastMessage {
        message
        sender {
          _id
          retryStatus {
            isRetry
            timestamp
          }
          queuedStatus {
            isQueued
            timestamp
          }
          sentStatus {
            isSent
            timestamp
          }
        }
        receivers {
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
        timestamp
      }
      createdAt
    }
  }
`) as DocumentNode;

const CHATS_QUERY = gql(/* GraphQL */ `
  query chats($userId: String!, $limit: Int, $after: ID) {
    chats(input: { userId: $userId }, limit: $limit, after: $after) {
      _id
      type
      members {
        _id
        hasAdded
        name
        picture
        email
        email_verified
        given_name
        family_name
        unreadMessagesCount
      }
      lastMessage {
        message
        sender {
          _id
          retryStatus {
            isRetry
            timestamp
          }
          queuedStatus {
            isQueued
            timestamp
          }
          sentStatus {
            isSent
            timestamp
          }
        }
        receivers {
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
        timestamp
      }
      createdAt
    }
  }
`) as DocumentNode;

const CREATE_CHAT_MUTATION = gql(/* GraphQL */ `
  mutation createChat(
    $userId: String!
    $type: String!
    $friendIds: [String!]!
    $friendUserIds: [String!]!
  ) {
    createChat(
      input: {
        userId: $userId
        type: $type
        friendIds: $friendIds
        friendUserIds: $friendUserIds
      }
    ) {
      isAlreadyCreated
      chat {
        _id
        type
        members {
          _id
          hasAdded
          name
          picture
          email
          email_verified
          given_name
          family_name
          unreadMessagesCount
        }
        friends {
          _id
        }
        createdAt
      }
    }
  }
`) as DocumentNode;

const CHAT_ADDED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnChatAdded {
    OnChatAdded {
      friendIds
      chat {
        _id
        type
        members {
          _id
          hasAdded
          name
          picture
          email
          email_verified
          given_name
          family_name
          unreadMessagesCount
        }
        lastMessage {
          message
          sender {
            _id
            retryStatus {
              isRetry
              timestamp
            }
            queuedStatus {
              isQueued
              timestamp
            }
            sentStatus {
              isSent
              timestamp
            }
          }
          receivers {
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
          timestamp
        }
        createdAt
      }
    }
  }
`) as DocumentNode;

const CHAT_UPDATED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnChatUpdated {
    OnChatUpdated {
      chat {
        _id
        type
        members {
          _id
          hasAdded
          name
          picture
          email
          email_verified
          given_name
          family_name
          unreadMessagesCount
        }
        lastMessage {
          message
          sender {
            _id
            retryStatus {
              isRetry
              timestamp
            }
            queuedStatus {
              isQueued
              timestamp
            }
            sentStatus {
              isSent
              timestamp
            }
          }
          receivers {
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
          timestamp
        }
        createdAt
      }
    }
  }
`) as DocumentNode;

const FRIEND_QUERY = gql(/* GraphQL */ `
  query friend($friendId: String!, $userId: String!) {
    friend(input: { friendId: $friendId, userId: $userId }) {
      _id
      type
      members {
        _id
        hasAdded
        name
        picture
        email
        email_verified
        given_name
        family_name
      }
      lastMessage {
        message
        sender {
          _id
          retryStatus {
            isRetry
            timestamp
          }
          queuedStatus {
            isQueued
            timestamp
          }
          sentStatus {
            isSent
            timestamp
          }
        }
        receivers {
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
        timestamp
      }
      hasChats
      createdAt
    }
  }
`) as DocumentNode;

const FRIENDS_QUERY = gql(/* GraphQL */ `
  query friends($userId: String!, $limit: Int, $after: ID) {
    friends(input: { userId: $userId }, limit: $limit, after: $after) {
      _id
      type
      members {
        _id
        hasAdded
        name
        picture
        email
        email_verified
        given_name
        family_name
      }
      lastMessage {
        message
        sender {
          _id
          retryStatus {
            isRetry
            timestamp
          }
          queuedStatus {
            isQueued
            timestamp
          }
          sentStatus {
            isSent
            timestamp
          }
        }
        receivers {
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
        timestamp
      }
      hasChats
      createdAt
    }
  }
`) as DocumentNode;

const OTHER_FRIENDS_QUERY = gql(/* GraphQL */ `
  query otherFriends($userId: String!, $limit: Int, $after: ID) {
    otherFriends(input: { userId: $userId }, limit: $limit, after: $after) {
      _id
      type
      members {
        _id
        hasAdded
        name
        picture
        email
        email_verified
        given_name
        family_name
      }
      lastMessage {
        message
        sender {
          _id
          retryStatus {
            isRetry
            timestamp
          }
          queuedStatus {
            isQueued
            timestamp
          }
          sentStatus {
            isSent
            timestamp
          }
        }
        receivers {
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
        timestamp
      }
      hasChats
      createdAt
    }
  }
`) as DocumentNode;

const FRIEND_ADDED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnFriendAdded {
    OnFriendAdded {
      friend {
        _id
        type
        members {
          _id
          hasAdded
          name
          picture
          email
          email_verified
          given_name
          family_name
        }
        lastMessage {
          message
          sender {
            _id
            retryStatus {
              isRetry
              timestamp
            }
            queuedStatus {
              isQueued
              timestamp
            }
            sentStatus {
              isSent
              timestamp
            }
          }
          receivers {
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
          timestamp
        }
        hasChats
        createdAt
      }
    }
  }
`) as DocumentNode;

const PENDING_REQUESTS_QUERY = gql(/* GraphQL */ `
  query pendingRequests($userId: String!, $limit: Int, $after: ID) {
    pendingRequests(input: { userId: $userId }, limit: $limit, after: $after) {
      data {
        _id
        members {
          _id
          hasSent
          name
          picture
          email
          email_verified
          given_name
          family_name
        }
      }
      totalCount
    }
  }
`) as DocumentNode;

const SENT_REQUESTS_QUERY = gql(/* GraphQL */ `
  query sentRequests($userId: String!, $limit: Int, $after: ID) {
    sentRequests(input: { userId: $userId }, limit: $limit, after: $after) {
      data {
        _id
        members {
          _id
          hasSent
          name
          picture
          email
          email_verified
          given_name
          family_name
        }
      }
      totalCount
    }
  }
`) as DocumentNode;

const CREATE_REQUEST_MUTATION = gql(/* GraphQL */ `
  mutation createRequest($userId: String!, $sendToEmail: String!) {
    createRequest(input: { userId: $userId, sendToEmail: $sendToEmail }) {
      _id
    }
  }
`) as DocumentNode;

const UPDATE_REQUEST_MUTATION = gql(/* GraphQL */ `
  mutation updateRequest(
    $userId: String!
    $requestId: String!
    $status: String!
  ) {
    updateRequest(
      input: { userId: $userId, requestId: $requestId, status: $status }
    ) {
      _id
    }
  }
`) as DocumentNode;

const REQUEST_ADDED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnRequestAdded {
    OnRequestAdded {
      request {
        _id
        members {
          _id
          hasSent
          name
          picture
          email
          email_verified
          given_name
          family_name
        }
      }
    }
  }
`) as DocumentNode;

const REQUEST_UPDATED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnRequestUpdated {
    OnRequestUpdated {
      request {
        _id
        members {
          _id
          hasSent
          name
          picture
          email
          email_verified
          given_name
          family_name
        }
      }
    }
  }
`) as DocumentNode;

const SESSIONS_QUERY = gql(/* GraphQL */ `
  query userSessions($userId: String!) {
    userSessions(input: { userId: $userId }) {
      _id
      userId
      lastActive
      deviceDetails
      expires
      lastActive
    }
  }
`) as DocumentNode;

const SESSION_UPDATED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnSessionUpdated($sessionID: String!) {
    OnSessionUpdated(input: { sessionID: $sessionID }) {
      session {
        _id
        userId
        lastActive
        deviceDetails
        expires
        lastActive
      }
    }
  }
`) as DocumentNode;

const USER_ONLINE_STATUS_QUERY = gql(/* GraphQL */ `
  query userOnlineStatus($userId: String!) {
    userOnlineStatus(input: { userId: $userId }) {
      userId
      onlineStatus {
        isOnline
        lastSeen
      }
    }
  }
`) as DocumentNode;

const USER_ONLINE_STATUS_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnUserOnlineStatus {
    OnUserOnlineStatus {
      userId
      onlineStatus {
        isOnline
        lastSeen
      }
    }
  }
`) as DocumentNode;

export {
  CHATS_QUERY,
  CHAT_ADDED_SUBSCRIPTION,
  CHAT_QUERY,
  CHAT_UPDATED_SUBSCRIPTION,
  CREATE_CHAT_MUTATION,
  CREATE_MESSAGE_MUTATION,
  CREATE_REQUEST_MUTATION,
  FRIENDS_QUERY,
  FRIEND_ADDED_SUBSCRIPTION,
  CACHED_MESSAGES_QUERY,
  MESSAGES_QUERY,
  MESSAGE_ADDED_SUBSCRIPTION,
  FRIEND_QUERY,
  MESSAGE_UPDATED_SUBSCRIPTION,
  OTHER_FRIENDS_QUERY,
  PENDING_REQUESTS_QUERY,
  REQUEST_ADDED_SUBSCRIPTION,
  REQUEST_UPDATED_SUBSCRIPTION,
  SENT_REQUESTS_QUERY,
  UPDATE_REQUEST_MUTATION,
  SESSIONS_QUERY,
  SESSION_UPDATED_SUBSCRIPTION,
  USER_ONLINE_STATUS_QUERY,
  USER_ONLINE_STATUS_SUBSCRIPTION,
};
