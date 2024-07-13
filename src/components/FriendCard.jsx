import {
  getChatId,
  getMessages,
  createChat,
} from "@/redux/actions/chatActions";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactTimeago from "react-timeago";

const FriendCard = ({ friend }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [chatId, setChatId] = useState(null);
  const messages = useSelector(
    (state) => state.getMessagesReducer.messages[chatId] || []
  );
  const loading = useSelector((state) => state.getMessagesReducer.loading);

  const fetchChatId = async () => {
    let id = await dispatch(getChatId(user?.username, friend?.username));
    if (!id) {
      id = await dispatch(createChat(user?.username, friend?.username));
    }

    setChatId(id);

    const unsubscribe = dispatch(getMessages(id));
    return () => unsubscribe();
  };

  useEffect(() => {
    if (user && friend) {
      fetchChatId();
    }
  }, [user, friend]);

  const truncateMessageText = (message, n) => {
    return message.length > n ? message.slice(0, n) + "..." : message;
  };

  return (
    <Link
      to={`/c/${chatId}`}
      className="flex justify-start items-center gap-2 w-full p-1 transform transition-all ease-in-out duration-200 hover:bg-[#414040] hover:rounded-lg active:scale-95"
    >
      <img
        src={friend.photoURL}
        className="w-8 h-8 rounded-full object-cover"
        alt=""
      />

      <div className="flex flex-col justify-start items-start">
        <strong>{friend.username}</strong>
        {messages.slice(0, 1).map((message) => (
          <div
            key={message.id}
            className="flex justify-center items-center gap-1.5"
          >
            <div className={`font-semibold`}>
              <div className="">
                {message.sender.username === user?.username ? (
                  <p>You: {truncateMessageText(message.message, 10)}</p>
                ) : (
                  <div className="">
                    {message.isRead ? (
                      <p>{truncateMessageText(message.message, 10)}</p>
                    ) : (
                      <p className="text-[#4450B5]">New chat</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="text-[#C1C1C1]">·</p>
            <p className="text-[#C1C1C1]">
              <ReactTimeago
                date={new Date(message.createdAt?.toDate().toUTCString())}
              />
            </p>
          </div>
        ))}

        {loading && <>Loading...</>}
      </div>
    </Link>
  );
};

export default FriendCard;
