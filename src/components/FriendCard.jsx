import React from "react";
import { Link } from "react-router-dom";

const FriendCard = ({ friend }) => {

  return (
    <Link
      to={`/c/${friend.username}`}
      className="flex justify-start items-center gap-2 w-full p-1 transform transition-all ease-in-out duration-200 hover:bg-[#414040] hover:rounded-lg active:scale-95"
    >
      <img
        src={friend.photoURL}
        className="w-8 h-8 rounded-full object-cover"
        alt=""
      />

      <div className="flex flex-col justify-start items-start">
        <strong>{friend.username}</strong>

        <div className="flex justify-center items-center gap-1.5">
          <p className="text-[#4450B5] font-semibold">New chat</p>
          <p className="text-[#C1C1C1]">·</p>
          <p className="text-[#C1C1C1]">4m</p>
        </div>
      </div>
    </Link>
  );
};

export default FriendCard;
