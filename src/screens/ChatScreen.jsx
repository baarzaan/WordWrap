import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack, IoIosInformationCircleOutline } from "react-icons/io";
import ChatSheet from "@/components/ChatSheet";
import SideBar from "@/components/layout/SideBar";
import MessageCard from "@/components/MessageCard";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  sendMessage,
  getMessages,
  updateMessageStatus,
} from "@/redux/actions/chatActions";
import {
  getGroupMessages,
  sendMessageToGroup,
  updateGroupMessageStatus,
} from "@/redux/actions/groupActions";

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
  const foundChat = chats.find((chat) => chat.id === chatId);
  const foundGroup = groups.find((group) => group.id === chatId);

  const getChat = () => {
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

      const foundGroupParticipant = users.filter((user) =>
        groupParticipants.includes(user.username)
      );
      setParticipants(foundGroupParticipant);
    }
  };

  useEffect(() => {
    getChat();

    if (foundChat && user) {
      dispatch(updateMessageStatus(chatId, user.username));
    } else if (foundGroup && user) {
      dispatch(updateGroupMessageStatus(chatId, user.username));
    }
  }, [chats, chatId, friends, user, groups, users]);

  const fetchChatId = async () => {
    if (foundChat) {
      const unsubscribe = dispatch(getMessages(chatId));
      return () => unsubscribe();
    } else if (foundGroup) {
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
            <div className="main__layout grid grid-cols-5 gap-4 h-screen w-full">
              <div className="md:grid hidden sidebar col-span-2">
                <SideBar />
              </div>

              <div className="col-span-3 w-full">
                <div className="relative flex flex-col justify-start items-start gap-10 p-2 h-screen w-full">
                  {/* Chat Header */}
                  <header className="flex justify-between items-center w-full h-16 px-2 bg-[#242423] rounded-lg">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        title="Close chat"
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
                              {participants.slice(0, 3)
                                .filter(
                                  (participant) =>
                                    participant.username != user.username
                                )
                                .map((participant) => (
                                  <div key={participant.id} className="flex">
                                    <img
                                      title={
                                        participant.firstName +
                                        " " +
                                        participant.lastName +
                                        " " +
                                        `@${participant.username}`
                                      }
                                      src={participant.photoURL}
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
                      <Sheet>
                        <SheetTrigger asChild>
                          <button
                            title="Conversation information"
                            className="transform transition-all easy-in-out duration-200 active:scale-95"
                          >
                            <IoIosInformationCircleOutline size={25} />
                          </button>
                        </SheetTrigger>
                        <SheetContent>
                          <ChatSheet
                            participants={participants}
                            group={group}
                          />
                        </SheetContent>
                      </Sheet>
                    </div>
                  </header>

                  {/* Chat Body */}
                  <div className="flex flex-col-reverse gap-3 overflow-y-auto h-[70%] w-full">
                    {foundChat
                      ? messages.map((message) => (
                          <MessageCard
                            key={message.id}
                            message={message}
                            chatId={chatId}
                            group={false}
                          />
                        ))
                      : groupMessages.map((message) => (
                          <MessageCard
                            key={message.id}
                            message={message}
                            chatId={chatId}
                            group={true}
                          />
                        ))}

                    {loading && (
                      <div className="flex justify-center items-center h-full mx-auto">
                        Loading...
                      </div>
                    )}
                    {error && <p className="text-red-600">{error}</p>}
                  </div>

                  {/* Send Chat */}
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
                        if (foundChat) {
                          dispatch(
                            sendMessage(
                              chatId,
                              user,
                              participants.map(
                                (participant) => participant.friendData.username
                              ),
                              message
                            )
                          );
                        } else {
                          dispatch(
                            sendMessageToGroup(
                              chatId,
                              user,
                              participants
                                .filter(
                                  (participant) =>
                                    participant.username != user.username
                                )
                                .map((participant) => participant.username),
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
