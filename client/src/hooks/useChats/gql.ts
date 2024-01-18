import { gql } from '@apollo/client';

const CHATS_QUERY = gql`
  query chats($channelId: String!) {
    chats(chatData: { channelId: $channelId }) {
      _id
      message
      sentByUserId
      sentToUserId
      creationDateShort
      creationDateLong
    }
  }
`;

const CHAT_MUTATION = gql`
  mutation newChat(
    $message: String
    $channelId: String!
    $sentByUserId: String
    $sentToUserId: String
  ) {
    newChat(
      chatData: {
        message: $message
        channelId: $channelId
        sentByUserId: $sentByUserId
        sentToUserId: $sentToUserId
      }
      limit: 25
      skip: 0
    ) {
      _id
      message
      channelId
      sentByUserId
      sentToUserId
      creationDateShort
      creationDateLong
    }
  }
`;

const CHAT_ADDED_SUBSCRIPTION = gql`
  subscription chatAdded {
    chatAdded {
      _id
      message
      sentByUserId
      sentToUserId
      creationDateShort
      creationDateLong
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
        creationDateShort
        creationDateLong
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
