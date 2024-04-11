/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  query chats($userId: String!) {\n    chats(input: { userId: $userId }, limit: 25, skip: 0) {\n      _id\n      type\n      members {\n        _id\n        hasAdded\n        memberDetails {\n          name\n          email\n          email_verified\n          picture\n          given_name\n          family_name\n        }\n      }\n    }\n  }\n':
    types.ChatsDocument,
  '\n  mutation createChat(\n    $friendId: String!\n    $type: String!\n    $members: [MemberInput!]!\n  ) {\n    createChat(input: { friendId: $friendId, type: $type, members: $members }) {\n      _id\n    }\n  }\n':
    types.CreateChatDocument,
  '\n  subscription OnChatAdded {\n    OnChatAdded {\n      friendId\n      chat {\n        _id\n        type\n        members {\n          _id\n          hasAdded\n          memberDetails {\n            name\n            email\n            email_verified\n            picture\n            given_name\n            family_name\n          }\n        }\n      }\n    }\n  }\n':
    types.OnChatAddedDocument,
  '\n  subscription OnChatUpdated {\n    OnChatUpdated {\n      friendId\n      chat {\n        _id\n        type\n        members {\n          _id\n          hasAdded\n          memberDetails {\n            name\n            email\n            email_verified\n            picture\n            given_name\n            family_name\n          }\n        }\n      }\n    }\n  }\n':
    types.OnChatUpdatedDocument,
  '\n  query friends($userId: String!) {\n    friends(input: { userId: $userId }, limit: 25, skip: 0) {\n      _id\n      isFriend\n      members {\n        _id\n        hasAdded\n        memberDetails {\n          name\n          email\n          email_verified\n          picture\n          given_name\n          family_name\n        }\n      }\n    }\n  }\n':
    types.FriendsDocument,
  '\n  query otherFriends($userId: String!) {\n    otherFriends(input: { userId: $userId }, limit: 25, skip: 0) {\n      _id\n      isFriend\n      members {\n        _id\n        hasAdded\n        memberDetails {\n          name\n          email\n          email_verified\n          picture\n          given_name\n          family_name\n        }\n      }\n    }\n  }\n':
    types.OtherFriendsDocument,
  '\n  subscription OnFriendAdded {\n    OnFriendAdded {\n      friend {\n        _id\n        isFriend\n        members {\n          _id\n          hasAdded\n          memberDetails {\n            name\n            email\n            email_verified\n            picture\n            given_name\n            family_name\n          }\n        }\n      }\n    }\n  }\n':
    types.OnFriendAddedDocument,
  '\n  query messages($userId: String!, $chatId: String!) {\n    messages(input: { userId: $userId, chatId: $chatId }, limit: 25, skip: 0) {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n':
    types.MessagesDocument,
  '\n  subscription OnMessageAdded {\n    OnMessageAdded {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n':
    types.OnMessageAddedDocument,
  '\n  subscription OnMessagesAdded {\n    OnMessagesAdded {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n':
    types.OnMessagesAddedDocument,
  '\n  subscription OnMessageUpdated {\n    OnMessageUpdated {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n':
    types.OnMessageUpdatedDocument,
  '\n  subscription OnMessagesUpdated {\n    OnMessagesUpdated {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n':
    types.OnMessagesUpdatedDocument,
  '\n  query requests($sentByUserId: String!) {\n    requests(input: { sentByUserId: $sentByUserId }, limit: 25, skip: 0) {\n      _id\n      sentByUserId\n      sentToUserId\n      userDetails {\n        _id\n        name\n        email\n        email_verified\n        picture\n        given_name\n        family_name\n      }\n    }\n  }\n':
    types.RequestsDocument,
  '\n  query sentRequests($sentByUserId: String!) {\n    sentRequests(input: { sentByUserId: $sentByUserId }, limit: 25, skip: 0) {\n      _id\n      sentByUserId\n      sentToUserId\n      userDetails {\n        _id\n        name\n        email\n        email_verified\n        picture\n        given_name\n        family_name\n      }\n    }\n  }\n':
    types.SentRequestsDocument,
  '\n  mutation createRequest($sentByUserId: String!, $sendToEmail: String!) {\n    createRequest(\n      input: { sentByUserId: $sentByUserId, sendToEmail: $sendToEmail }\n    ) {\n      _id\n    }\n  }\n':
    types.CreateRequestDocument,
  '\n  mutation updateRequest($requestId: String!, $status: String!) {\n    updateRequest(input: { requestId: $requestId, status: $status }) {\n      _id\n    }\n  }\n':
    types.UpdateRequestDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query chats($userId: String!) {\n    chats(input: { userId: $userId }, limit: 25, skip: 0) {\n      _id\n      type\n      members {\n        _id\n        hasAdded\n        memberDetails {\n          name\n          email\n          email_verified\n          picture\n          given_name\n          family_name\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query chats($userId: String!) {\n    chats(input: { userId: $userId }, limit: 25, skip: 0) {\n      _id\n      type\n      members {\n        _id\n        hasAdded\n        memberDetails {\n          name\n          email\n          email_verified\n          picture\n          given_name\n          family_name\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation createChat(\n    $friendId: String!\n    $type: String!\n    $members: [MemberInput!]!\n  ) {\n    createChat(input: { friendId: $friendId, type: $type, members: $members }) {\n      _id\n    }\n  }\n',
): (typeof documents)['\n  mutation createChat(\n    $friendId: String!\n    $type: String!\n    $members: [MemberInput!]!\n  ) {\n    createChat(input: { friendId: $friendId, type: $type, members: $members }) {\n      _id\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  subscription OnChatAdded {\n    OnChatAdded {\n      friendId\n      chat {\n        _id\n        type\n        members {\n          _id\n          hasAdded\n          memberDetails {\n            name\n            email\n            email_verified\n            picture\n            given_name\n            family_name\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  subscription OnChatAdded {\n    OnChatAdded {\n      friendId\n      chat {\n        _id\n        type\n        members {\n          _id\n          hasAdded\n          memberDetails {\n            name\n            email\n            email_verified\n            picture\n            given_name\n            family_name\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  subscription OnChatUpdated {\n    OnChatUpdated {\n      friendId\n      chat {\n        _id\n        type\n        members {\n          _id\n          hasAdded\n          memberDetails {\n            name\n            email\n            email_verified\n            picture\n            given_name\n            family_name\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  subscription OnChatUpdated {\n    OnChatUpdated {\n      friendId\n      chat {\n        _id\n        type\n        members {\n          _id\n          hasAdded\n          memberDetails {\n            name\n            email\n            email_verified\n            picture\n            given_name\n            family_name\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query friends($userId: String!) {\n    friends(input: { userId: $userId }, limit: 25, skip: 0) {\n      _id\n      isFriend\n      members {\n        _id\n        hasAdded\n        memberDetails {\n          name\n          email\n          email_verified\n          picture\n          given_name\n          family_name\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query friends($userId: String!) {\n    friends(input: { userId: $userId }, limit: 25, skip: 0) {\n      _id\n      isFriend\n      members {\n        _id\n        hasAdded\n        memberDetails {\n          name\n          email\n          email_verified\n          picture\n          given_name\n          family_name\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query otherFriends($userId: String!) {\n    otherFriends(input: { userId: $userId }, limit: 25, skip: 0) {\n      _id\n      isFriend\n      members {\n        _id\n        hasAdded\n        memberDetails {\n          name\n          email\n          email_verified\n          picture\n          given_name\n          family_name\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query otherFriends($userId: String!) {\n    otherFriends(input: { userId: $userId }, limit: 25, skip: 0) {\n      _id\n      isFriend\n      members {\n        _id\n        hasAdded\n        memberDetails {\n          name\n          email\n          email_verified\n          picture\n          given_name\n          family_name\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  subscription OnFriendAdded {\n    OnFriendAdded {\n      friend {\n        _id\n        isFriend\n        members {\n          _id\n          hasAdded\n          memberDetails {\n            name\n            email\n            email_verified\n            picture\n            given_name\n            family_name\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  subscription OnFriendAdded {\n    OnFriendAdded {\n      friend {\n        _id\n        isFriend\n        members {\n          _id\n          hasAdded\n          memberDetails {\n            name\n            email\n            email_verified\n            picture\n            given_name\n            family_name\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query messages($userId: String!, $chatId: String!) {\n    messages(input: { userId: $userId, chatId: $chatId }, limit: 25, skip: 0) {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query messages($userId: String!, $chatId: String!) {\n    messages(input: { userId: $userId, chatId: $chatId }, limit: 25, skip: 0) {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  subscription OnMessageAdded {\n    OnMessageAdded {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  subscription OnMessageAdded {\n    OnMessageAdded {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  subscription OnMessagesAdded {\n    OnMessagesAdded {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  subscription OnMessagesAdded {\n    OnMessagesAdded {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  subscription OnMessageUpdated {\n    OnMessageUpdated {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  subscription OnMessageUpdated {\n    OnMessageUpdated {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  subscription OnMessagesUpdated {\n    OnMessagesUpdated {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  subscription OnMessagesUpdated {\n    OnMessagesUpdated {\n      chatId\n      data {\n        _id\n        chatId\n        message\n        otherMembers {\n          _id\n          deliveredStatus {\n            isDelivered\n            timestamp\n          }\n          readStatus {\n            isRead\n            timestamp\n          }\n        }\n        sender {\n          _id\n          sentStatus {\n            isSent\n            timestamp\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query requests($sentByUserId: String!) {\n    requests(input: { sentByUserId: $sentByUserId }, limit: 25, skip: 0) {\n      _id\n      sentByUserId\n      sentToUserId\n      userDetails {\n        _id\n        name\n        email\n        email_verified\n        picture\n        given_name\n        family_name\n      }\n    }\n  }\n',
): (typeof documents)['\n  query requests($sentByUserId: String!) {\n    requests(input: { sentByUserId: $sentByUserId }, limit: 25, skip: 0) {\n      _id\n      sentByUserId\n      sentToUserId\n      userDetails {\n        _id\n        name\n        email\n        email_verified\n        picture\n        given_name\n        family_name\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query sentRequests($sentByUserId: String!) {\n    sentRequests(input: { sentByUserId: $sentByUserId }, limit: 25, skip: 0) {\n      _id\n      sentByUserId\n      sentToUserId\n      userDetails {\n        _id\n        name\n        email\n        email_verified\n        picture\n        given_name\n        family_name\n      }\n    }\n  }\n',
): (typeof documents)['\n  query sentRequests($sentByUserId: String!) {\n    sentRequests(input: { sentByUserId: $sentByUserId }, limit: 25, skip: 0) {\n      _id\n      sentByUserId\n      sentToUserId\n      userDetails {\n        _id\n        name\n        email\n        email_verified\n        picture\n        given_name\n        family_name\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation createRequest($sentByUserId: String!, $sendToEmail: String!) {\n    createRequest(\n      input: { sentByUserId: $sentByUserId, sendToEmail: $sendToEmail }\n    ) {\n      _id\n    }\n  }\n',
): (typeof documents)['\n  mutation createRequest($sentByUserId: String!, $sendToEmail: String!) {\n    createRequest(\n      input: { sentByUserId: $sentByUserId, sendToEmail: $sendToEmail }\n    ) {\n      _id\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation updateRequest($requestId: String!, $status: String!) {\n    updateRequest(input: { requestId: $requestId, status: $status }) {\n      _id\n    }\n  }\n',
): (typeof documents)['\n  mutation updateRequest($requestId: String!, $status: String!) {\n    updateRequest(input: { requestId: $requestId, status: $status }) {\n      _id\n    }\n  }\n'];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
