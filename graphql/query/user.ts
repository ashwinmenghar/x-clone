import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`
  #graphql
  query VerifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = graphql(`
  query GetCurrentUser {
    getCurrentUser {
      id
      profileImageURL
      email
      firstName
      lastName
      username
      recommendedUsers {
        id
        firstName
        lastName
        profileImageURL
        username
      }
      followers {
        id
        firstName
        lastName
        profileImageURL
        username
      }
      following {
        id
        firstName
        lastName
        profileImageURL
        username
      }
      tweets {
        id
        content
        imageURL
        createdAt
        likes {
          id
          user {
            id
          }
        }
        author {
          id
          firstName
          lastName
          profileImageURL
          username
        }
      }
    }
  }
`);

export const getUserByIdQuery = graphql(`
  #graphql
  query GetuserById($id: ID!) {
    getUserById(id: $id) {
      id
      firstName
      lastName
      profileImageURL
      username

      followers {
        id
        firstName
        lastName
        profileImageURL
        username
      }
      following {
        id
        firstName
        lastName
        profileImageURL
        username
      }
      tweets {
        id
        content
        imageURL
        createdAt
        likes {
          id
          user {
            id
          }
        }
        author {
          id
          firstName
          lastName
          profileImageURL
          username
        }
      }
    }
  }
`);
