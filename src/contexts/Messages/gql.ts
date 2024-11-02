import { DocumentNode } from 'graphql';
import { gql } from '../../__generated__/gql';

const MESSAGES_QUERY = gql(/* GraphQL */ `
  query messages($chatId: String!, $after: ID) {
    messages(input: { chatId: $chatId }, limit: 25, after: $after) {
      edges {
        _id
        chatId
        queueId
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
        timestamp
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`) as DocumentNode;

const MESSAGE_GROUPS_QUERY = gql(/* GraphQL */ `
  query messageGroups($chatId: String!) {
    messageGroups(input: { chatId: $chatId }) {
      edges {
        dateLabel
        groups {
          side
          data {
            _id
            chatId
            queueId
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
            timestamp
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      queuedPageInfo {
        endCursor
        hasNextPage
      }
      scrollPosition
    }
  }
`) as DocumentNode;

const MESSAGE_QUEUED_QUERY = gql(/* GraphQL */ `
  query messageQueued($queueId: String!) {
    messageQueued(input: { queueId: $queueId }) {
      _id
    }
  }
`) as DocumentNode;

const CREATE_MESSAGE_MUTATION = gql(/* GraphQL */ `
  mutation createMessage(
    $chatId: String!
    $senderId: String!
    $queueId: String!
    $isQueued: Boolean!
    $queuedTimestamp: Float!
    $isSent: Boolean!
    $sentTimestamp: Float!
    $message: String!
  ) {
    createMessage(
      input: {
        chatId: $chatId
        senderId: $senderId
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

const UPDATE_MESSAGE_MUTATION = gql(/* GraphQL */ `
  mutation updateMessage(
    $chatId: String!
    $senderId: String!
    $queueId: String!
    $isQueued: Boolean!
    $queuedTimestamp: Float!
    $isSent: Boolean!
    $sentTimestamp: Float!
    $message: String!
  ) {
    updateMessage(
      input: {
        chatId: $chatId
        senderId: $senderId
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
      chatId
      message {
        _id
        chatId
        queueId
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
        timestamp
      }
    }
  }
`) as DocumentNode;

const MESSAGE_UPDATED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnMessageUpdated {
    OnMessageUpdated {
      chatId
      message {
        _id
        chatId
        queueId
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
        timestamp
      }
    }
  }
`) as DocumentNode;

export {
  MESSAGES_QUERY,
  MESSAGE_GROUPS_QUERY,
  MESSAGE_QUEUED_QUERY,
  CREATE_MESSAGE_MUTATION,
  UPDATE_MESSAGE_MUTATION,
  MESSAGE_ADDED_SUBSCRIPTION,
  MESSAGE_UPDATED_SUBSCRIPTION,
};
