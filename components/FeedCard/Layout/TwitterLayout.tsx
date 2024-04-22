import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { BsBell, BsBookmark, BsEnvelope, BsTwitterX } from "react-icons/bs";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import Image from "next/image";
import { SlOptions } from "react-icons/sl";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { graphqlClient } from "@/client/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import Link from "next/link";
import { HiOutlineDotsHorizontal, HiUsers } from "react-icons/hi";
import { CiViewList } from "react-icons/ci";
import {
  getItemWithExpiration,
  setItemWithExpiration,
} from "@/components/feedcardLogic";

import Cookies from "js-cookie";

interface TwitterLayoutProps {
  children: React.ReactNode;
}
interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}
type News = {
  status: string;
  totalResults: number;
  articles: {
    source: {
      id: null;
      name: string;
    };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
  }[];
};

const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [news, setNews] = useState<News>({
    articles: [],
    status: "",
    totalResults: 0,
  });

  const sidebarMenuItems: TwitterSidebarButton[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <BiHomeCircle />,
        link: "/",
      },
      {
        title: "Explore",
        icon: <BiHash />,
        link: "/",
      },
      {
        title: "Notifications",
        icon: <BsBell />,
        link: "/",
      },
      {
        title: "Messages",
        icon: <BsEnvelope />,
        link: "/",
      },
      {
        title: "Grok",
        icon: "/",
        link: "/",
      },
      {
        title: "Lists",
        icon: <CiViewList />,
        link: "/",
      },
      {
        title: "Bookmarks",
        icon: <BsBookmark />,
        link: "/",
      },
      {
        title: "Communities",
        icon: <HiUsers />,
        link: "/",
      },
      {
        title: "Premium",
        icon: <BsTwitterX />,
        link: "/",
      },
      {
        title: "Profile",
        icon: <BiUser />,
        link: `/${user?.id}`,
      },
      {
        title: "More",
        icon: <SlOptions />,
        link: "/",
      },
    ],
    [user?.id]
  );

  const handleSignOut = useCallback(() => {
    toast.loading("please wait....", { id: "signout" });
    window.localStorage.removeItem("__twitter_token");

    queryClient.invalidateQueries({ queryKey: ["current-user"] });
    Cookies.remove("__user_info");

    toast.success("Sign Out", { id: "signout" });
  }, []);

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;

      if (!googleToken) return toast.error(`Google token not found`);

      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );

      toast.success("verify success");

      if (verifyGoogleToken) {
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);
      }

      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      await queryClient.invalidateQueries({ queryKey: ["all-tweets"] });

      handleUserInfoStorage();
    },
    [queryClient]
  );

  const handleUserInfoStorage = () => {
    Cookies.set(
      "__user_info",
      JSON.stringify({
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        username: user?.username,
      }),
      { expires: 7 }
    );
  };

  useEffect(() => {
    const handleNewsData = async () => {
      if (news && news?.articles && news?.articles?.length > 0) return;
      const newsData = getItemWithExpiration("__news_data");

      if (newsData != null) {
        setNews(JSON.parse(newsData) as any);
        return;
      }

      if (newsData == null) {
        const data = await fetch(
          `https://newsapi.org/v2/everything?q=tesla&from=2024-03-22&sortBy=publishedAt&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}&pageSize=10`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.status == "ok") {
              setItemWithExpiration("__news_data", JSON.stringify(data), 30);
              setNews(data);
            }
          })
          .catch((err) => console.log(err));
        setNews(data as any);
      }
    };

    handleNewsData();
  }, [news]);

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
        <div className="col-span-1 sm:col-span-2 pt-1 flex sm:justify-end pr-4 relative">
          <div className="">
            <div className="text-2xl w-fit h-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer translate-all">
              <BsTwitterX />
            </div>
            <div className="mt-2 text-xl pr-4">
              <ul>
                {sidebarMenuItems.map((item) =>
                  item.title == "Profile" && !user ? null : (
                    <li key={item.title}>
                      <Link
                        href={item.link}
                        className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-4 py-2  w-fit cursor-pointer mt-2"
                        shallow
                      >
                        <span className="text-3xl font-bold">{item.icon}</span>
                        <span className="hidden sm:inline ">{item.title}</span>
                      </Link>
                    </li>
                  )
                )}
              </ul>
              <div className="mt-5 px-3">
                <button className="hidden sm:block bg-[#1d9bf0] font-semibold text-lg py-2 px-4 rounded-full w-full">
                  Post
                </button>
                <button className="block sm:hidden bg-[#1d9bf0] font-semibold text-lg py-2 px-4 rounded-full w-full">
                  <BsTwitterX />
                </button>
              </div>
            </div>
            {user && (
              <div
                className="absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full cursor-pointer"
                onClick={(prev) => setIsOpen(!isOpen)}
              >
                {user?.profileImageURL && (
                  <Image
                    className="rounded-full"
                    src={user.profileImageURL}
                    alt="user-image"
                    height={50}
                    width={50}
                  />
                )}
                <div className="hidden sm:block">
                  <h3 className="text-sm font-bold">
                    {user.firstName} {user.lastName}
                  </h3>
                  <div className="text-xs font-semibold">@{user?.username}</div>
                </div>
                <div className="hidden sm:block">
                  <HiOutlineDotsHorizontal />
                </div>
                {isOpen && (
                  <div className="absolute bottom-16">
                    <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        <li
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          onClick={handleSignOut}
                        >
                          Sign out @{user?.username}
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-11 sm:col-span-6 border-r-[1px] border-l-[1px] h-screen overflow-scroll border-gray-600">
          {props.children}
        </div>

        <div className="col-span-0 sm:col-span-4 p-5 h-screen overflow-scroll">
          {!user ? (
            <div className="p-5 bg-slate-700 rounded-lg">
              <h1 className="my-2 text-2xl">New to Twitter</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          ) : (
            <div className="px-4 py-3 bg-slate-800 rounded-lg">
              <h1 className="my-2 text-2xl mb-5">Users you may know</h1>
              {user?.recommendedUsers?.map((el) => (
                <div className="flex items-center gap-3 mt-2" key={el?.id}>
                  {el?.profileImageURL && (
                    <Image
                      src={el?.profileImageURL}
                      alt="user-image"
                      className="rounded-full"
                      width={60}
                      height={60}
                    />
                  )}
                  <div>
                    <div className="text-lg">
                      {el?.firstName} {el?.lastName}
                    </div>
                    <Link
                      href={`/${el?.id}`}
                      className="bg-white text-black text-sm px-5 py-1 w-full rounded-lg"
                      shallow
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border h-auto rounded-lg border-slate-600 mt-5">
            <h5 className="font-semibold text-xl p-3">Explore</h5>
            {news &&
              news?.articles?.map((el, idx) => (
                <div className="p-2" key={idx}>
                  <div
                    className={`${
                      idx < news?.articles?.length - 1
                        ? "border-b mb-2 border-slate-800"
                        : "mb-4"
                    }`}
                  >
                    <Link href={el?.url} target="_blank">
                      <div className="text-sm font-semibold px-2 py-1">
                        {el?.title.substring(0, 100)}
                      </div>
                      <div className="text-xs text-slate-500 p-1 flex gap-1">
                        <p>Trending now</p>
                        <p>.</p>
                        <p> techcrunch</p>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterLayout;
