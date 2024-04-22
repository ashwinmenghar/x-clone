import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(`
  query GetAllTweets {
    getAllTweets {
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
`);

export const getSignedURLForTweetQuery = graphql(`
  #graphql

  query getSignURL($imageName: String!, $imageType: String!) {
    getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
  }
`);

export const getPerPageTweetsQuery = graphql(`
  #graphql

  query getPerPageTweets($page: Int!) {
    getTweetPerPage(page: $page) {
      id
      content
      imageURL
      createdAt
      author {
        id
        firstName
        lastName
        profileImageURL
        username
      }
    }
  }
`);
