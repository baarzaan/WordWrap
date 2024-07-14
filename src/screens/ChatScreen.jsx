import MessageCard from "@/components/MessageCard";
import {
  createChat,
  getChatId,
  sendMessage,
  getMessages,
  updateMessageStatus,
} from "@/redux/actions/chatActions";
import {
  getGroupMessages,
  sendMessageToGroup,
} from "@/redux/actions/groupActions";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosInformationCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const ChatScreen = () => {
  const dispatch = useDispatch();
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const user = useSelector((state) => state.user.user);
  const friends = useSelector((state) => state.friends.friends);
  const users = useSelector((state) => state.users.users);
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState("");
  const messages = useSelector(
    (state) => state.getMessagesReducer.messages[chatId] || []
  );
  const loading = useSelector((state) => state.getMessagesReducer.loading);
  const error = useSelector((state) => state.getMessagesReducer.error);
  const navigate = useNavigate();
  const chats = useSelector((state) => state.chats.chats);
  const groups = useSelector((state) => state.getGroups.groups);
  const [group, setGroup] = useState(null);
  const groupMessages = useSelector(
    (state) => state.groupMessages?.messages?.[chatId] || []
  );

  const getChat = () => {
    const foundChat = chats.find((chat) => chat.id === chatId);
    const foundGroup = groups.find((group) => group.id === chatId);

    if (foundChat) {
      setChat(foundChat);
      const participantUsernames = foundChat.participants;

      const foundParticipant = friends.filter((friend) =>
        participantUsernames.includes(friend.friendData.username)
      );
      setParticipants(foundParticipant);
    } else if (foundGroup) {
      setChat(foundGroup);
      setGroup(foundGroup);
      const groupParticipants = foundGroup.participants;

      const foundGroupParticipant = friends.filter((friend) =>
        groupParticipants.includes(friend.friendData.username)
      );
      setParticipants(foundGroupParticipant);
    }
  };

  useEffect(() => {
    getChat();

    if (chatId && user) {
      dispatch(updateMessageStatus(chatId, user.email));
    }
  }, [chats, chatId, friends, user]);

  const fetchChatId = async () => {
    if (chats.find((chat) => chat.id === chatId)) {
      const unsubscribe = dispatch(getMessages(chatId));
      return () => unsubscribe();
    } else if (groups.find((group) => group.id == chatId)) {
      const unsubscribe = dispatch(getGroupMessages(chatId));
      return () => unsubscribe();
    }
  };

  useEffect(() => {
    if (user && participants) {
      fetchChatId();
    }
  }, [user, participants]);

  return (
    <>
      {user ? (
        <>
          {chat ? (
            <div className="relative flex flex-col justify-start items-start gap-10 p-2 h-screen w-full">
              {/* Chat Header */}
              <header className="flex justify-between items-center w-full h-16 px-2 bg-[#242423] rounded-lg">
                <div className="flex justify-center items-center gap-2">
                  <button
                    title="Back"
                    onClick={() => navigate("/")}
                    className="transform transition-all ease-in-out duration-200 hover:bg-[#404040] p-1 rounded-full active:scale-95"
                  >
                    <IoIosArrowBack size={22} />
                  </button>

                  {participants && (
                    <React.Fragment>
                      {!group ? (
                        <>
                          {participants
                            .filter(
                              (participant) =>
                                participant.friendData.username !=
                                user?.username
                            )
                            .map((participant) => (
                              <React.Fragment
                                key={participant.friendData.username}
                              >
                                <img
                                  src={participant.friendData.photoURL}
                                  className="w-8 h-8 rounded-full object-cover"
                                  alt=""
                                />
                                <strong>
                                  {participant.friendData.username}
                                </strong>
                              </React.Fragment>
                            ))}
                        </>
                      ) : (
                        <div className="flex justify-center items-center gap-2">
                          {participants.map((participant) => (
                            <div className="flex">
                              <img
                                title={
                                  participant.friendData.firstName +
                                  " " +
                                  participant.friendData.lastName +
                                  " " +
                                  `@${participant.friendData.username}`
                                }
                                src={participant.friendData.photoURL}
                                className="w-8 h-8 rounded-full object-cover"
                                alt=""
                              />
                            </div>
                          ))}

                          <strong>{group?.groupName}</strong>
                        </div>
                      )}
                    </React.Fragment>
                  )}
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

              <div className="flex flex-col-reverse gap-3 overflow-y-auto h-[70%] w-full">
                {chats.find((chat) => chat.id === chatId)
                  ? messages.map((message) => (
                      <MessageCard
                        key={message.id}
                        message={message}
                        chatId={chatId}
                      />
                    ))
                  : groupMessages.map((message) => (
                      <MessageCard
                        key={message.id}
                        message={message}
                        chatId={chatId}
                      />
                    ))}

                {loading && <>Loading...</>}
                {error && <p className="text-red-600">{error}</p>}
              </div>

              <div className="absolute bottom-2 left-0 w-full flex justify-center items-center gap-2 px-2 bg-[#212121]">
                <textarea
                  className="w-full bg-transparent border border-[#707070] rounded-lg p-2 resize-none"
                  placeholder="Message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />

                <button
                  onClick={() => {
                    if (chats.find((chat) => chat.id === chatId)) {
                      dispatch(
                        sendMessage(
                          chatId,
                          user,
                          participants.map(
                            (participant) => participant.friendData
                          ),
                          message
                        )
                      );
                    } else {
                      dispatch(
                        sendMessageToGroup(
                          chatId,
                          user,
                          participants.map(
                            (participant) => participant.friendData
                          ),
                          message
                        )
                      );
                    }
                    setMessage("");
                  }}
                  disabled={message.trim() === ""}
                  className={`bg-[#404040] rounded-lg px-4 py-2 ${
                    message.trim() === ""
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
