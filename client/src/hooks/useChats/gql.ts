import { gql } from '@apollo/client';

const CHATS_QUERY = gql`
  query chats($channelId: String!) {
    chats(chatData: { channelId: $channelId }) {
      _id
      creationDateLong
      creationDateShort
      message
      sentByUserId
      sentToUserId
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
  ) {
    newChat(
      chatData: {
        channelId: $channelId
        message: $message
        sentByUserId: $sentByUserId
        sentToUserId: $sentToUserId
        status: $status
      }
      limit: 25
      skip: 0
    ) {
      _id
      channelId
      creationDateLong
      creationDateShort
      message
      sentByUserId
      sentToUserId
      status
    }
  }
`;

const CHAT_ADDED_SUBSCRIPTION = gql`
  subscription chatAdded {
    chatAdded {
      _id
      creationDateLong
      creationDateShort
      message
      sentByUserId
      sentToUserId
    }
  }
`;

const CHAT_UPDATED_SUBSCRIPTION = gql`
  subscription chatUpdated {
    chatUpdated {
      channelId
      data {
        _id
        creationDateLong
        creationDateShort
        message
        sentByUserId
        sentToUserId
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
