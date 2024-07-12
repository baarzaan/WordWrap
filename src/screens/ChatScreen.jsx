import {
  getChats,
  sendChat,
  updateChatStatus,
} from "@/redux/actions/chatActions";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosInformationCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const ChatScreen = () => {
  const dispatch = useDispatch();
  const { friendUsername } = useParams();
  const user = useSelector((state) => state.user.user);
  const friends = useSelector((state) => state.friends.friends);
  const [friend, setFriend] = useState(null);
  const [chat, setChat] = useState("");
  const { loading, chats, error } = useSelector((state) => state.chats);
  const navigate = useNavigate();

  const getFriend = () => {
    const foundFriend = friends.find(
      (friend) =>
        friend.friendData.username === friendUsername &&
        friend.requestStatus.isAccepted
    );
    setFriend(foundFriend);
  };

  useEffect(() => {
    getFriend();
  }, [friends, friendUsername]);

  useEffect(() => {
    if (user && friend) {
      dispatch(getChats(user, friend));
    }
  }, [user, friend, dispatch]);

  useEffect(() => {
    if (user && friend) {
      dispatch(updateChatStatus(user, friend, friendUsername));
    }
  }, [user, friend, friendUsername]);

  return (
    <>
      {user ? (
        <>
          {friend ? (
            <div className="relative flex flex-col justify-start items-start gap-10 p-2 h-screen">
              <header className="flex justify-between items-center w-full h-10 px-2 bg-[#242423] rounded-lg">
                <div className="flex justify-center items-center gap-2">
                  <button
                    title="Back"
                    onClick={() => navigate("/")}
                    className="transform transition-all ease-in-out duration-200 hover:bg-[#404040] p-1 rounded-full active:scale-95"
                  >
                    <IoIosArrowBack size={22} />
                  </button>

                  <img
                    src={friend.friendData.photoURL}
                    className="w-8 h-8 rounded-full object-cover"
                    alt=""
                  />
                  <strong>{friend.friendData.username}</strong>
                </div>

                <div>
                  <button
                    title="More"
                    className="transform transition-all easy-in-out duration-200 active:scale-95"
                  >
                    <IoIosInformationCircleOutline size={25} />
                  </button>
                </div>
              </header>

              <div className="flex flex-col overflow-y-auto">
                {chats.map((chat) => (
                  <div
                    title={chat.isRead ? "Seen" : "Unseen"}
                    key={chat.id}
                    className={`${
                      chat.sender.email === user.email
                        ? "border border-red-500"
                        : ""
                    }`}
                  >
                    {chat.chat}
                  </div>
                ))}

                {loading && <>Loading...</>}
                {error && <p className="text-red-600">{error}</p>}
              </div>

              <div className="absolute bottom-2 left-0 w-full flex justify-center items-center gap-2 px-2">
                <textarea
                  className="w-full bg-transparent border border-[#707070] rounded-lg p-2 resize-none"
                  placeholder="Chat..."
                  value={chat}
                  onChange={(e) => setChat(e.target.value)}
                  required
                />

                <button
                  onClick={() => {
                    dispatch(
                      sendChat(user, friend, {
                        chat,
                        createdAt: new Date(),
                        isRead: false,
                        sender: user,
                        receiver: friend.friendData,
                      })
                    );
                    setChat("");
                  }}
                  disabled={chat.trim() === ""}
                  className={`bg-[#404040] rounded-lg px-4 py-2 ${
                    chat.trim() === ""
                      ? "cursor-not-allowed"
                      : "transform transition-all ease-in-out duration-200 hover:bg-[#2b2a2a] active:scale-95"
                  }`}
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <>Friend not found</>
          )}
        </>
      ) : (
        <>404</>
      )}
    </>
  );
};

export default ChatScreen;
