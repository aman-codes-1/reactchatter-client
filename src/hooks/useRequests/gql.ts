import { DocumentNode } from 'graphql';
import { gql } from '../../__generated__';

const FRIEND_REQUESTS_QUERY = gql(/* GraphQL */ `
  query requests($sentByUserId: String!) {
    requests(input: { sentByUserId: $sentByUserId }, limit: 25, skip: 0) {
      _id
      sentByUserId
      sentToUserId
      userDetails {
        _id
        name
        email
        email_verified
        picture
        given_name
        family_name
      }
    }
  }
`) as DocumentNode;

const SENT_REQUESTS_QUERY = gql(/* GraphQL */ `
  query sentRequests($sentByUserId: String!) {
    sentRequests(input: { sentByUserId: $sentByUserId }, limit: 25, skip: 0) {
      _id
      sentByUserId
      sentToUserId
      userDetails {
        _id
        name
        email
        email_verified
        picture
        given_name
        family_name
      }
    }
  }
`) as DocumentNode;

const CREATE_REQUEST_MUTATION = gql(/* GraphQL */ `
  mutation createRequest($sentByUserId: String!, $sendToEmail: String!) {
    createRequest(
      input: { sentByUserId: $sentByUserId, sendToEmail: $sendToEmail }
    ) {
      _id
    }
  }
`) as DocumentNode;

const UPDATE_REQUEST_MUTATION = gql(/* GraphQL */ `
  mutation updateRequest($requestId: String!, $status: String!) {
    updateRequest(input: { requestId: $requestId, status: $status }) {
      _id
    }
  }
`) as DocumentNode;

export {
  FRIEND_REQUESTS_QUERY,
  SENT_REQUESTS_QUERY,
  CREATE_REQUEST_MUTATION,
  UPDATE_REQUEST_MUTATION,
};
