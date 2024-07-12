import React from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaRegPenToSquare } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import UserDetails from "../UserDetails";
import AddFriend from "../AddFriend";
import FriendCard from "../FriendCard";

const SideBar = () => {
  const user = useSelector((state) => state.user.user);
  const requests = useSelector((state) => state.friendRequests.requests);
  const friends = useSelector((state) => state.friends.friends);

  return (
    <>
      {user ? (
        <div className="sticky top-0 left-0 w-full h-screen bg-[#242423] flex flex-col justify-start items-start px-2 py-4 gap-5">
          <div className="flex flex-col justify-center items-center gap-3 w-full border-b border-b-[#2a2a2a] p-1">
            <Link to="/" className="text-3xl font-bold">
              LOGO
            </Link>

            <div className="flex justify-between items-center w-full">
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="default">
                      <img
                        src={user.photoURL}
                        className="w-10 h-10 object-cover rounded-full cursor-pointer"
                        alt={user.firstName.charAt(0)}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full">
                    <UserDetails user={user} />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent w-full px-5 py-2 border border-[#404040] rounded-md"
                />
              </div>

              <div className="flex justify-center items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      title="Add friend"
                      className="relative bg-[#424242] p-1 w-10 h-10 flex justify-center items-center rounded-full transform transition-all ease-in-out duration-200 hover:opacity-80 active:scale-95"
                    >
                      <AiOutlineUserAdd size={28} />

                      <div className="absolute -top-4 left-0 bg-red-600 text-white w-5 h-5 flex justify-center items-center rounded-full">
                        <p>{requests.length}</p>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full">
                    <AddFriend />
                  </PopoverContent>
                </Popover>

                <button
                  title="Create group"
                  className="bg-[#424242] p-1 w-10 h-10 flex justify-center items-center rounded-full transform transition-all ease-in-out duration-200 hover:opacity-80 active:scale-95"
                >
                  <FaRegPenToSquare size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start gap-4 w-full p-1">
            {friends.map((friend) => (
              <div key={friend.id} className="w-full border-b border-b-[#404040] last:border-none">
                {friend.requestStatus.isPending ? null : (
                  <FriendCard friend={friend.friendData} />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SideBar;
