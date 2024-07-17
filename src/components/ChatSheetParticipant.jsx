import {
  rejectFriendRequest,
  removeFriend,
  toggleSendFriendRequest,
} from "@/redux/actions/friendsActions";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatSheetParticipant = ({ participant, group }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const friends = useSelector((state) => state.friends.friends);
  const requests = useSelector((state) => state.friendRequests.requests);
  const success = useSelector(
    (state) => state.toggleSendFriendRequestReducer.success
  );
  const navigate = useNavigate();

  const isFriend = (participant) =>
    friends.some(
      (friend) =>
        friend.friendData.email == participant.email &&
        friend.requestStatus.isAccepted
    );

  const isSendFriendRequest = (participant) => {
    return friends.find(
      (isSend) =>
        isSend.friendData.email == participant.email &&
        isSend.requestStatus.isPending
    );
  };

  return (
    <div className="w-full overflow-y-auto p-2 bg-[#424242] text-white rounded-lg flex flex-col justify-start items-start gap-3 border-b border-b-[#707070] last:border-none">
      {group ? (
        <>
          {isFriend(participant) ? (
            <button
              onClick={() => {
                const friend = friends.find(
                  (friend) => friend.friendData.email === participant.email
                );
                dispatch(removeFriend(user, friend, friend.id));
                alert("Friend removed successfully!");
              }}
              className="transform transition-all ease-in-out duration-300 hover:text-[#969393] active:scale-95"
            >
              Remove friend
            </button>
          ) : (
            <>
              {isSendFriendRequest(participant) ? (
                <button
                  onClick={() => {
                    dispatch(toggleSendFriendRequest(user, participant));
                    alert(success);
                  }}
                  className="transform transition-all ease-in-out duration-300 hover:text-[#969393] active:scale-95"
                >
                  Reject friend request
                </button>
              ) : (
                <button
                  onClick={() => {
                    dispatch(toggleSendFriendRequest(user, participant));
                    alert(success);
                  }}
                  className="transform transition-all ease-in-out duration-300 hover:text-[#969393] active:scale-95"
                >
                  Add friend
                </button>
              )}
            </>
          )}

          <button className="transform transition-all ease-in-out duration-300 hover:text-[#969393] active:scale-95">
            Remove from group
          </button>
        </>
      ) : (
        <>
          {isFriend(participant.friendData) ? (
            <button
              onClick={() => {
                const friend = friends.find(
                  (friend) =>
                    friend.friendData.email === participant.friendData.email
                );
                dispatch(removeFriend(user, friend, friend.id));
                alert("Friend removed successfully!");
                navigate("/");
              }}
              className="transform transition-all ease-in-out duration-300 hover:text-[#969393] active:scale-95"
            >
              Remove friend
            </button>
          ) : (
            <>
              {isSendFriendRequest(participant) ? (
                <button
                  onClick={() => {
                    dispatch(
                      toggleSendFriendRequest(user, participant.friendData)
                    );
                    alert(success);
                  }}
                  className="transform transition-all ease-in-out duration-300 hover:text-[#969393] active:scale-95"
                >
                  Reject friend request
                </button>
              ) : (
                <button
                  onClick={() => {
                    dispatch(
                      toggleSendFriendRequest(user, participant.friendData)
                    );
                    alert(success);
                  }}
                  className="transform transition-all ease-in-out duration-300 hover:text-[#969393] active:scale-95"
                >
                  Add friend
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ChatSheetParticipant;
