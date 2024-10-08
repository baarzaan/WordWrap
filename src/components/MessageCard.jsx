import { deleteMessage } from "@/redux/actions/chatActions";
import { deleteGroupMessage } from "@/redux/actions/groupActions";
import React from "react";
import { PiTrash } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import ReactTimeago from "react-timeago";

const MessageCard = ({ message, chatId, group }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const groups = useSelector((state) => state.getGroups.groups);
  const groupId = groups.find((group) => group.id == chatId);

  return (
    <div
      title={
        groupId
          ? message.seenBy.length === 0 ||
            message.seenBy.every((username) => username === user?.username)
            ? ""
            : message.seenBy.length === message.receivers.length
            ? "Seen by all"
            : `Seen by ${message.seenBy
                .filter((username) => username !== user?.username)
                .join(", ")}`
          : message.receiver === user?.username
          ? null
          : message.isRead && "Seen"
      }
      className="flex gap-2 p-2 w-[300px] max-w-lg bg-[#2a2a2a] rounded-lg"
    >
      <img
        src={message.sender.photoURL}
        className="w-8 h-8 rounded-full object-cover"
        alt=""
      />

      <div className="flex flex-col justify-start items-start gap-1.5 w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-center items-center gap-1">
            <strong>{message.sender.username}</strong>
            <p className="text-[#969393]">
              <ReactTimeago
                date={new Date(message.createdAt?.toDate().toUTCString())}
              />
            </p>
          </div>

          {message.sender.username == user?.username && (
            <button
              title="Delete message"
              onClick={() =>
                group
                  ? dispatch(deleteGroupMessage(chatId, message.id))
                  : dispatch(deleteMessage(chatId, message.id))
              }
              className="transform transition-all ease-in-out duration-300 p-1 rounded-full hover:bg-[#242423] active:scale-95"
            >
              <PiTrash size={22} />
            </button>
          )}
        </div>

        <p className="whitespace-pre-wrap">{message.message}</p>
      </div>
    </div>
  );
};

export default MessageCard;
