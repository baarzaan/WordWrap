import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const FriendCard = ({ friend }) => {
  const [lastChat, setLastChat] = useState([]);
  const user = useSelector((state) => state.user.user);

  const getLastChat = async () => {
    try {
      const chatCollection = collection(
        db,
        `chats/${user.email}/friends/${friend.email}/chats`
      );
      onSnapshot(
        query(chatCollection, orderBy("createdAt", "desc"), limit(1)),
        (snapshot) => {
          const lastChat = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLastChat(lastChat);
        }
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getLastChat();
  }, [lastChat]);

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
          {lastChat.slice(0, 1).map((chat) => (
            <div
              className={`font-semibold ${
                chat.isRead && chat.receiver.email != user?.email
                  ? ""
                  : "text-[#4450B5]"
              }`}
            >
              {chat.isRead && chat.receiver.email != user?.email ? (
                <p>
                  {chat.sender.email == user?.email
                    ? `You: ${chat.chat}`
                    : chat.chat}
                </p>
              ) : (
                "New chat"
              )}
            </div>
          ))}
          <p className="text-[#C1C1C1]">·</p>
          <p className="text-[#C1C1C1]">4m</p>
        </div>
      </div>
    </Link>
  );
};

export default FriendCard;
