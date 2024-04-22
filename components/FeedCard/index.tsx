import { graphqlClient } from "@/client/api";
import { Tweet, User } from "@/gql/graphql";
import { createLikeMutation, unLikeMutation } from "@/graphql/mutation/tweet";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineHeart } from "react-icons/ai";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { FcLike } from "react-icons/fc";

interface FeedCardProps {
  data: Tweet;
  user: User;
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const { data, user } = props;

  const queryClient = useQueryClient();

  const [like, setLike] = useState(false);
  const [likeId, setLikeId] = useState("");

  useEffect(() => {
    if (user == null) setLike(false);

    if (
      data?.likes &&
      data?.likes[0]?.user?.id !== undefined &&
      data?.likes[0]?.user?.id === user?.id
    ) {
      setLike(true);
      setLikeId(data?.likes[0].id);
    }
  }, [data?.likes, user]);

  const handleCreateLike = useCallback(
    async (tweetId: string) => {
      if (!user) {
        toast.error("You need to login first", { duration: 3000 });
        return;
      }

      const likeData = await graphqlClient.request(createLikeMutation, {
        userId: user?.id,
        tweetId: tweetId,
      });

      if (likeData) {
        setLike(!like);
        setLikeId(likeData?.createLike?.id as string);
      }
    },
    [user, like]
  );

  const handleUnLike = useCallback(async () => {
    if (likeId == null) {
      return;
    }

    const response = await graphqlClient.request(unLikeMutation, {
      likeId,
    });

    if (response) {
      setLike(false);
      setLikeId("");
    }
  }, [likeId]);

  return (
    <div className="border border-l-0 border-r-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 translate-all cursor-pointer">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-1">
          {data.author?.profileImageURL && (
            <Image
              className="rounded-full"
              src={data.author?.profileImageURL}
              alt="user-image"
              height={50}
              width={50}
              priority
            />
          )}
        </div>
        <div className="col-span-11">
          <h5>
            <Link href={`/${data.author?.id}`} shallow>
              {data.author?.firstName} {data.author?.lastName}{" "}
              <span className="text-sm text-slate-500">
                @{data.author?.username}
              </span>
            </Link>
          </h5>
          <p className="mt-3">{data.content}</p>
          {data.imageURL && (
            <Image
              src={data.imageURL}
              alt="image"
              width={400}
              height={400}
              className="rounded-lg"
              priority
            />
          )}
          <div className="flex justify-between mt-5 text-xl items-center p-2 w-[90%]">
            <div className="">
              <BiMessageRounded />
            </div>
            <div className="">
              <FaRetweet />
            </div>
            <div className="color-red">
              {like ? (
                <FcLike onClick={() => handleUnLike()} />
              ) : (
                <AiOutlineHeart onClick={() => handleCreateLike(data.id)} />
              )}
            </div>
            <div className="">
              <BiUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
