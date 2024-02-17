import { gql } from '@apollo/client';

const CHATS_QUERY = gql`
  query chats($channelId: String!) {
    chats(chatData: { channelId: $channelId }) {
      _id
      channelId
      message
      sentByUserId
      sentToUserId
      sentDateLong
      sentDateShort
      status
      timestamp
    }
  }
`;

const CHAT_MUTATION = gql`
  mutation newChat(
    $channelId: String!
    $message: String!
    $sentByUserId: String!
    $sentToUserId: String!
    $status: String!
    $timestamp: Float!
  ) {
    newChat(
      chatData: {
        channelId: $channelId
        message: $message
        sentByUserId: $sentByUserId
        sentToUserId: $sentToUserId
        status: $status
        timestamp: $timestamp
      }
      limit: 25
      skip: 0
    ) {
      _id
    }
  }
`;

const CHAT_ADDED_SUBSCRIPTION = gql`
  subscription chatAdded {
    chatAdded {
      channelId
      data {
        _id
        message
        sentByUserId
        sentToUserId
        sentDateLong
        sentDateShort
        status
        timestamp
      }
    }
  }
`;

const CHAT_UPDATED_SUBSCRIPTION = gql`
  subscription chatUpdated {
    chatUpdated {
      channelId
      data {
        _id
        message
        sentByUserId
        sentToUserId
        sentDateLong
        sentDateShort
        status
        timestamp
      }
    }
  }
`;

export {
  CHATS_QUERY,
  CHAT_MUTATION,
  CHAT_ADDED_SUBSCRIPTION,
  CHAT_UPDATED_SUBSCRIPTION,
};
