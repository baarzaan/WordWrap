import React, { useCallback, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { useDispatch, useSelector } from "react-redux";
import { IoIosAdd, IoIosCheckmark, IoIosClose } from "react-icons/io";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  toggleSendFriendRequest,
} from "@/redux/actions/friendsActions";
import { rejectFriendRequestReducer } from "@/redux/reducers/friendsReducers";
import { truncateText } from "@/utils/truncateText";

const AddFriend = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const success = useSelector(
    (state) => state.toggleSendFriendRequestReducer.success
  );
  const requests = useSelector((state) => state.friendRequests.requests);
  const friends = useSelector((state) => state.friends.friends);
  const users = useSelector((state) => state.users.users);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isPending, startTransition] = useTransition();

  const searchUser = useCallback(() => {
    try {
      if (search.length > 0) {
        startTransition(() => {
          const filteredUsers = users.filter((user) =>
            user.username.toLowerCase().includes(search.toLocaleLowerCase())
          );
          setFilteredUsers(filteredUsers);
        });
      } else {
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [search, users]);

  useEffect(() => {
    searchUser();
  }, [searchUser]);

  return (
    <div className="w-full h-[150px] overflow-y-auto p-2 bg-[#424242] text-white rounded-lg flex flex-col justify-start items-start gap-3">
      <div className="flex w-full border-b border-b-[#707070] py-2">
        <Input
          value={search.toLocaleLowerCase()}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
        />
      </div>

      {search.length > 0 ? (
        <>
          {isPending ? (
            <>Loading...</>
          ) : (
            <div className="flex flex-col justify-center items-center gap-4 w-full border-b border-b-[#707070] pb-1.5 last:border-none">
              {filteredUsers.map((filteredUser) => (
                <div
                  key={filteredUser.id}
                  className="flex justify-between items-center w-full px-0.5"
                >
                  <div className="flex justify-center items-center gap-1">
                    <img
                      src={filteredUser.photoURL}
                      loading="lazy"
                      className="w-8 h-8 rounded-full object-cover"
                      alt=""
                    />

                    <strong>{truncateText(filteredUser.username, 10)}</strong>
                  </div>

                  {filteredUser.email != user?.email && (
                    <>
                      {friends.map((friend) => (
                        <>
                          {friend.friendData.email == filteredUser.email &&
                          friend.requestStatus.isAccepted ? (
                            <button
                              title="Remove friend"
                              onClick={() => {
                                dispatch(removeFriend(user, filteredUser));
                                alert("Friend removed successfully!");
                              }}
                              className="bg-[#242423] rounded-full transform transition-all ease-in-out duration-300 hover:bg-[#242423]/75 active:scale-95"
                            >
                              <IoIosClose size={24} />
                            </button>
                          ) : (
                            <button
                              title="Add friend"
                              onClick={() => {
                                dispatch(
                                  toggleSendFriendRequest(user, filteredUser)
                                );
                                alert(success);
                              }}
                              className="bg-[#242423] rounded-full transform transition-all ease-in-out duration-300 hover:bg-[#242423]/75 active:scale-95"
                            >
                              <IoIosAdd size={24} />
                            </button>
                          )}
                        </>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col justify-start items-start gap-2 w-full">
          <strong>Friend Requests ({requests.length})</strong>
          {requests.length > 0 ? (
            <div className="flex flex-col justify-center items-center border-b border-b-[#707070] last:border-none w-full">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex justify-between items-center w-full px-0.5"
                >
                  <div className="flex justify-center items-center gap-1">
                    <img
                      src={request.friendData.photoURL}
                      loading="lazy"
                      className="w-8 h-8 rounded-full object-cover"
                      alt=""
                    />
                    <strong>
                      {truncateText(request.friendData.username, 10)}
                    </strong>
                  </div>

                  <div className="flex justify-center items-center gap-1">
                    <button
                      title="Accept friend request"
                      onClick={() =>
                        dispatch(acceptFriendRequest(user, request, request.id))
                      }
                      className="bg-[#242423] rounded-full transform transition-all ease-in-out duration-300 hover:bg-[#242423]/75 active:scale-95"
                    >
                      <IoIosCheckmark size={24} />
                    </button>

                    <button
                      title="Reject friend request"
                      onClick={() => {
                        dispatch(
                          rejectFriendRequest(user, request, request.id)
                        );
                        alert(success);
                      }}
                      className="bg-[#242423] rounded-full transform transition-all ease-in-out duration-300 hover:bg-[#242423]/75 active:scale-95"
                    >
                      <IoIosClose size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#e4e4e5]">No friend requests yet!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddFriend;
