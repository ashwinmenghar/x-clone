import { graphqlClient } from "@/client/api";
import FeedCard from "@/components/FeedCard";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import { Tweet, User } from "@/gql/graphql";
import {
  getAllTweetsQuery,
  getPerPageTweetsQuery,
  getSignedURLForTweetQuery,
} from "@/graphql/query/tweet";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { useCurrentUser } from "@/hooks/user";
import axios from "axios";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiImageAlt } from "react-icons/bi";

import { useInView } from "react-intersection-observer";

interface HomeProps {
  tweets?: Tweet[];
}

export default function Home(props: HomeProps) {
  const { user } = useCurrentUser();
  const { mutateAsync } = useCreateTweet();

  const { tweets = props.tweets as Tweet[] } = useGetAllTweets();

  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");

  const [page, setPage] = useState(1);
  const [allTweets, setTweetData] = useState<any[]>([] as Tweet[]);
  const [isMoreData, setIsMoreData] = useState(true);

  const { ref, inView } = useInView();

  const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if (!file) return;

      const { getSignedURLForTweet } = await graphqlClient.request(
        getSignedURLForTweetQuery,
        {
          imageName: file.name,
          imageType: file.type,
        }
      );

      if (getSignedURLForTweet) {
        toast.loading("Uploading...", { id: "2" });
        await axios.put(getSignedURLForTweet, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
        toast.success("Upload Completed", { id: "2" });
        const url = new URL(getSignedURLForTweet);
        const myFilePath = `${url.origin}${url.pathname}`;
        setImageURL(myFilePath);
      }
    };
  }, []);

  const handleSelectImage = useCallback(() => {
    if (!user) {
      toast.error("You need to login first", { duration: 3000 });
      return;
    }
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    const handlerFn = handleInputChangeFile(input);

    input.addEventListener("change", handlerFn);

    input.click();
  }, [handleInputChangeFile, user]);

  const handleCreateTweet = useCallback(async () => {
    if (!user) {
      toast.error("You need to login first", { duration: 3000 });
      return;
    }

    if (!content) {
      return;
    }

    await mutateAsync({
      content,
      imageURL,
    });
    setContent("");
    setImageURL("");
  }, [mutateAsync, imageURL, user, content]);

  const delay = (ms: number) => {
    toast.loading("loading more data.....", { id: "3" });
    // return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const loadMoreTweets = useCallback(async () => {
    if (!isMoreData) return;
    delay(500);

    const nextPage = page + 1;
    const result = await graphqlClient.request(getPerPageTweetsQuery, {
      page: nextPage,
    });
    toast.dismiss("3");

    if (result.getTweetPerPage?.length == 0) {
      toast.success("end", { id: "3" });
      setIsMoreData(false);
    }

    setTweetData((prev) => [...prev, ...(result?.getTweetPerPage as Tweet[])]);
    setPage(nextPage);
  }, [page, isMoreData]);

  useEffect(() => {
    if (inView) loadMoreTweets();
  }, [inView]);

  return (
    <div>
      <TwitterLayout>
        <div>
          <div className="border border-l-0 border-r-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 translate-all cursor-pointer">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-1">
                {user?.profileImageURL && (
                  <Image
                    className="rounded-full"
                    src={user?.profileImageURL}
                    alt="user-image"
                    height={50}
                    width={50}
                  />
                )}
              </div>
              <div className="col-span-11">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent text-xl px-3 border-b border-slate-700"
                  placeholder="What's happening?"
                  rows={3}
                ></textarea>
                {imageURL && (
                  <Image
                    src={imageURL}
                    alt="tweet-image"
                    width={300}
                    height={300}
                  />
                )}
                <div className="mt-2 flex justify-between items-center">
                  <BiImageAlt className="text-xl" onClick={handleSelectImage} />
                  <button
                    className="hidden sm:block bg-[#1d9bf0] font-semibold text-sm py-2 px-4 rounded-full disabled:bg-[#4481a9]"
                    onClick={handleCreateTweet}
                    disabled={content.length > 0 ? false : true}
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {tweets?.map((tweet) =>
          tweet ? (
            <FeedCard
              key={tweet?.id}
              data={tweet as Tweet}
              user={user as User}
            />
          ) : null
        )}
        {allTweets &&
          allTweets?.map((tweet) =>
            tweet ? (
              <FeedCard
                key={tweet?.id}
                data={tweet as Tweet}
                user={user as User}
              />
            ) : null
          )}

        {isMoreData && (
          <div className="text-center p-2 mb-5" ref={ref}>
            Loading....
          </div>
        )}
      </TwitterLayout>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const allTweets = await graphqlClient.request(getAllTweetsQuery);

  return {
    props: {
      tweets: allTweets.getAllTweets as Tweet[],
    },
  };
};
