import { GraphQLClient } from "graphql-request";

const isClient = typeof window !== "undefined";

export const graphqlClient = new GraphQLClient(
  "https://x-server-new.onrender.com/graphql",
  {
    headers: () => ({
      Authorization: isClient
        ? `Bearer ${window.localStorage.getItem("__twitter_token")}`
        : "",
    }),
  }
);
