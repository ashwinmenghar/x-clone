import { GraphQLClient } from "graphql-request";

const isClient = typeof window !== "undefined";

export const graphqlClient = new GraphQLClient(
  // process.env.NEXT_PUBLIC_API_URL as string,
  "http://localhost:8000/graphql",
  {
    headers: () => ({
      Authorization: isClient
        ? `Bearer ${window.localStorage.getItem("__twitter_token")}`
        : "",
    }),
  }
);
