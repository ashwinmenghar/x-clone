import { graphqlClient } from "@/client/api";
import { CreateTweetData } from "@/gql/graphql";
import { createTweetMutation } from "@/graphql/mutation/tweet";
import { getAllTweetsQuery } from "@/graphql/query/tweet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateTweet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateTweetData) =>
      graphqlClient.request(createTweetMutation, { payload }),

    onMutate: (payload) => toast.loading("Creating tweet...", { id: "1" }),
    onSuccess: async (data) => {
      if (data?.createTweet?.id == "error") {
        toast.dismiss("1");
        toast.error("please wait...", { id: "error" });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["all-tweets"] });
      toast.success("Created Success", { id: "1" });
    },
    onError: (data) => {
      console.log(data);
      toast.error("Failed to create tweet", { id: "1" });
    },
  });

  return mutation;
};

export const useGetAllTweets = () => {
  const query = useQuery({
    queryKey: ["all-tweets"],
    queryFn: () => graphqlClient.request(getAllTweetsQuery),
  });

  return { ...query, tweets: query.data?.getAllTweets };
};

// export const useGetTweetsPerPage = () => {
//   const query = useQuery({
//     queryKey: ["tweets-per-page"],
//     queryFn: () => graphqlClient.request(getPerPageTweetsQuery, { page: 1 }),
//   });

//   console.log("query", query);

//   return { ...query, tweets: query.data };
// };
