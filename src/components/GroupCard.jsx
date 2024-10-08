import { getGroupMessages } from "@/redux/actions/groupActions";
import { truncateText } from "@/utils/truncateText";
import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactTimeago from "react-timeago";

const GroupCard = ({ group }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const messages = useSelector(
    (state) => state.groupMessages?.messages?.[group.id] || []
  );
  const loading = useSelector((state) => state.groupMessages.loading);
  const users = useSelector((state) => state.users.users);

  useEffect(() => {
    if (group.id) {
      dispatch(getGroupMessages(group.id));
    }
  }, [dispatch, users]);

  return (
    <Link
      to={`/c/${group.id}`}
      className="flex justify-start items-center gap-2 w-full p-1 transform transition-all ease-in-out duration-200 hover:bg-[#414040] hover:rounded-lg active:scale-95 border-b border-b-[#414040] last:border-none"
    >
      <div className="flex flex-col justify-start items-start">
        <strong>{group.groupName}</strong>
        {messages.length == 0 ? (
          <strong>Be first to send message</strong>
        ) : (
          <>
            {messages.slice(0, 1).map((message) => (
              <div
                key={message.id}
                className="flex justify-center items-center gap-1.5"
              >
                <div>
                  <div className="">
                    {message.sender.username === user?.username ? (
                      <strong>You: {truncateText(message.message, 10)}</strong>
                    ) : (
                      <>
                        {message.seenBy.find(
                          (username) => username === user?.username
                        ) ? (
                          <strong>
                            {message.sender.username}:{" "}
                            {truncateText(message.message, 10)}
                          </strong>
                        ) : (
                          <strong className="text-[#4450B5]">
                            New message
                          </strong>
                        )}
                      </>
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
          </>
        )}

        {loading && (
          <RotatingLines
            visible={true}
            height="25"
            width="25"
            color="grey"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        )}
      </div>
    </Link>
  );
};

export default GroupCard;
