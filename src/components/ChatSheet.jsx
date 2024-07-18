import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { MoreVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import ChatSheetParticipant from "./ChatSheetParticipant";
import { changeGroupName, leaveGroup } from "@/redux/actions/groupActions";
import { removeFriend } from "@/redux/actions/friendsActions";
import { useNavigate } from "react-router-dom";

const ChatSheet = ({ participants, group }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [showChangeGroupName, setShowChangeGroupName] = useState(false);
  const [groupName, setGroupName] = useState(group?.groupName);
  const loading = useSelector((state) => state.changeGroupNameReducer.loading);
  const navigate = useNavigate();

  return (
    <>
      <SheetHeader className="border-b border-b-[#707070]">
        <SheetTitle>Details</SheetTitle>
      </SheetHeader>
      <div className="flex flex-col justify-start items-start gap-4 py-3 w-full">
        {group && (
          <div className="flex flex-col gap-4 border-b border-b-[#707070] pb-2 w-full">
            <div className="flex justify-between items-center gap-2 w-full">
              <p>Change group name</p>

              <button
                onClick={() => setShowChangeGroupName(!showChangeGroupName)}
                className="bg-[#404041] py-1 px-2 rounded-lg transform transition-all ease-in-out duration-300 hover:bg-[#404041]/75 active:scale-95"
              >
                {showChangeGroupName ? "Close" : "Change"}
              </button>
            </div>

            {showChangeGroupName && (
              <div className="flex justify-between gap-2 w-full">
                <input
                  placeholder="Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="bg-transparent border border-[#707070] rounded-lg p-2"
                />

                <button
                  disabled={groupName.trim() == ""}
                  onClick={() => {
                    dispatch(
                      changeGroupName({
                        id: group.id,
                        groupName,
                      })
                    );
                    setShowChangeGroupName(false);
                  }}
                  className="bg-[#404041] py-1 px-2 rounded-lg transform transition-all ease-in-out duration-300 hover:bg-[#404041]/75 active:scale-95 disabled:cursor-not-allowed disabled:bg-[#5d5d5e] disabled:active:scale-100"
                >
                  {loading ? "Loading..." : "Change"}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col justify-start items-start gap-2 w-full overflow-y-clip">
          <div className="flex justify-between items-center w-full">
            <SheetTitle>
              Members {group && <>({group.participants.length})</>}
            </SheetTitle>

            {group && (
              <button className="text-[#e4e4e5] transform transition-all ease-in-out duration-300 hover:text-[#969393] active:scale-95">
                Add members
              </button>
            )}
          </div>

          <div className="flex flex-col w-full h-[115px] overflow-y-auto">
            {participants && (
              <>
                {!group ? (
                  <>
                    {participants
                      .filter(
                        (participant) =>
                          participant.friendData.username != user?.username
                      )
                      .map((participant) => (
                        <div
                          key={participant.id}
                          className="flex justify-between items-center gap-2 border-b border-b-[#707070] last:border-none w-full"
                        >
                          <div className="flex justify-start items-center gap-3">
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

                            <div className="flex flex-col justify-start items-start gap-0.5">
                              <strong>
                                {participant.friendData.firstName}{" "}
                                {participant.friendData.lastName}
                              </strong>
                              <p className="text-[#969393]">
                                {participant.friendData.username}
                              </p>
                            </div>
                          </div>

                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="transform transition-all ease-in-out duration-300 active:scale-95">
                                <MoreVertical size={22} color="#969393" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full">
                              <ChatSheetParticipant
                                participant={participant}
                                group={group}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      ))}
                  </>
                ) : (
                  <div className="flex flex-col justify-start items-center gap-3 w-full">
                    {participants
                      .filter(
                        (participant) => participant.username != user.username
                      )
                      .map((participant) => (
                        <div
                          key={participant.id}
                          className="flex justify-between items-center gap-2 border-b border-b-[#707070] last:border-none w-full"
                        >
                          <div className="flex justify-start items-center gap-3">
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

                            <div className="flex flex-col justify-start items-start gap-0.5">
                              <strong>
                                {participant.firstName} {participant.lastName}
                              </strong>
                              <p className="text-[#969393]">
                                {participant.username}
                              </p>
                            </div>
                          </div>

                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="transform transition-all ease-in-out duration-300 active:scale-95">
                                <MoreVertical size={22} color="#969393" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full">
                              <ChatSheetParticipant
                                participant={participant}
                                group={group}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <SheetFooter className="w-full">
        {group && (
          <button
            onClick={() => {
              dispatch(
                leaveGroup(
                  group.id,
                  group.participants.find(
                    (participant) => participant == user?.username
                  )
                )
              );
              navigate("/");
            }}
            className="flex justify-start items-start text-[#db3d3d] font-semibold transform transition-all duration-300 hover:text-[#c23030] active:scale-95 w-full"
          >
            Leave group
          </button>
        )}
      </SheetFooter>
    </>
  );
};

export default ChatSheet;
