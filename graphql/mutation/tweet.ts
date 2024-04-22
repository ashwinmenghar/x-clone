import { graphql } from "@/gql";

export const createTweetMutation = graphql(`
  #graphql

  mutation CreateTweet($payload: CreateTweetData!) {
    createTweet(payload: $payload) {
      id
    }
  }
`);

// export const createLikeMutation1 = graphql(`
//   #graphql

//   mutation createLike(userId: String!, tweetId: String!) {
//     createLike(userId: String!, tweetId: String!) {
//       id
//     }
//   }
// `);

export const createLikeMutation = graphql(
  `
    #graphql
    mutation createLike($userId: String!, $tweetId: String!) {
      createLike(userId: $userId, tweetId: $tweetId) {
        id
      }
    }
  `
);

export const unfollowUserMutation = graphql(
  `
    #graphql
    mutation UnFollowUser($to: ID!) {
      unFollowUser(to: $to)
    }
  `
);

export const unLikeMutation = graphql(
  `
    #graphql
    mutation unLike($likeId: String!) {
      unLike(likeId: $likeId) {
        id
      }
    }
  `
);
