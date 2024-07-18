import {
  getChatId,
  getMessages,
  createChat,
} from "@/redux/actions/chatActions";
import { toggleSendFriendRequest } from "@/redux/actions/friendsActions";
import { truncateText } from "@/utils/truncateText";
import React, { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactTimeago from "react-timeago";

const FriendCard = ({ friend, requestStatus }) => {
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

  return (
    <div className="w-full">
      {requestStatus.isPending ? (
        <div className="flex justify-between items-center gap-2 w-full p-1">
          <div className="flex justify-start items-center gap-2">
            <img
              src={friend.photoURL}
              className="w-8 h-8 rounded-full object-cover"
              alt=""
            />
            <strong>{friend.username}</strong>
          </div>

          <button
            title="Remove send friend request"
            onClick={() => {
              dispatch(toggleSendFriendRequest(user, friend));
            }}
            className="bg-[#414040] rounded-full transform transition-all ease-in-out duration-300 hover:bg-[#414040]/75 active:scale-95"
          >
            <IoIosClose size={24} />
          </button>
        </div>
      ) : (
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

            {messages.length == 0 ? (
              <strong>Send first message</strong>
            ) : (
              <>
                {messages.slice(0, 1).map((message) => (
                  <div
                    key={message.id}
                    className="flex justify-center items-center gap-1.5"
                  >
                    <div className="">
                      <div className="">
                        {message.sender.username === user?.username ? (
                          <strong>
                            You: {truncateText(message.message, 10)}
                          </strong>
                        ) : (
                          <div className="">
                            {message.isRead ? (
                              <strong>
                                {truncateText(message.message, 10)}
                              </strong>
                            ) : (
                              <strong className="text-[#4450B5]">
                                New message
                              </strong>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-[#C1C1C1]">·</p>
                    <p className="text-[#C1C1C1]">
                      <ReactTimeago
                        date={
                          new Date(message.createdAt?.toDate().toUTCString())
                        }
                      />
                    </p>
                  </div>
                ))}
              </>
            )}

            {loading && <>Loading...</>}
          </div>
        </Link>
      )}
    </div>
  );
};

export default FriendCard;
