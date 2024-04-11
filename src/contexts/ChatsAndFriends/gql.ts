import { DocumentNode } from 'graphql';
import { gql } from '../../__generated__/gql';

const CHATS_QUERY = gql(/* GraphQL */ `
  query chats($userId: String!) {
    chats(input: { userId: $userId }, limit: 25, skip: 0) {
      _id
      type
      members {
        _id
        hasAdded
        memberDetails {
          name
          email
          email_verified
          picture
          given_name
          family_name
        }
      }
    }
  }
`) as DocumentNode;

const CREATE_CHAT_MUTATION = gql(/* GraphQL */ `
  mutation createChat(
    $friendId: String!
    $type: String!
    $members: [MemberInput!]!
  ) {
    createChat(input: { friendId: $friendId, type: $type, members: $members }) {
      _id
    }
  }
`) as DocumentNode;

const CHAT_ADDED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnChatAdded {
    OnChatAdded {
      friendId
      chat {
        _id
        type
        members {
          _id
          hasAdded
          memberDetails {
            name
            email
            email_verified
            picture
            given_name
            family_name
          }
        }
      }
    }
  }
`) as DocumentNode;

const CHAT_UPDATED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnChatUpdated {
    OnChatUpdated {
      friendId
      chat {
        _id
        type
        members {
          _id
          hasAdded
          memberDetails {
            name
            email
            email_verified
            picture
            given_name
            family_name
          }
        }
      }
    }
  }
`) as DocumentNode;

const FRIENDS_QUERY = gql(/* GraphQL */ `
  query friends($userId: String!) {
    friends(input: { userId: $userId }, limit: 25, skip: 0) {
      _id
      isFriend
      members {
        _id
        hasAdded
        memberDetails {
          name
          email
          email_verified
          picture
          given_name
          family_name
        }
      }
    }
  }
`) as DocumentNode;

const OTHER_FRIENDS_QUERY = gql(/* GraphQL */ `
  query otherFriends($userId: String!) {
    otherFriends(input: { userId: $userId }, limit: 25, skip: 0) {
      _id
      isFriend
      members {
        _id
        hasAdded
        memberDetails {
          name
          email
          email_verified
          picture
          given_name
          family_name
        }
      }
    }
  }
`) as DocumentNode;

const FRIEND_ADDED_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription OnFriendAdded {
    OnFriendAdded {
      friend {
        _id
        isFriend
        members {
          _id
          hasAdded
          memberDetails {
            name
            email
            email_verified
            picture
            given_name
            family_name
          }
        }
      }
    }
  }
`) as DocumentNode;

export {
  CHATS_QUERY,
  CREATE_CHAT_MUTATION,
  CHAT_ADDED_SUBSCRIPTION,
  CHAT_UPDATED_SUBSCRIPTION,
  FRIENDS_QUERY,
  OTHER_FRIENDS_QUERY,
  FRIEND_ADDED_SUBSCRIPTION,
};
