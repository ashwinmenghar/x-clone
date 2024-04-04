import Image from "next/image";
import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";

const FeedCard: React.FC = () => {
  return (
    <div className="border border-l-0 border-r-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 translate-all cursor-pointer">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-1">
          <Image
            src="https://ashwin-portfolio-site.netlify.app/static/media/ashwin.96a7b2fb.png"
            alt="user-image"
            height={50}
            width={50}
          />
        </div>
        <div className="col-span-11">
          <h5>Ashwin</h5>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima
            voluptate asperiores sapiente at voluptatibus ipsa culpa veniam non
            minus sunt?
          </p>
          <div className="flex justify-between mt-5 text-xl items-center p-2 w-[90%]">
            <div className="">
              <BiMessageRounded />
            </div>
            <div className="">
              <FaRetweet />
            </div>
            <div className="">
              <AiOutlineHeart />
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
