import React, { useCallback, useEffect, useState, useTransition } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaRegPenToSquare } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
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
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import CreateGroupDialog from "../CreateGroupDialog";
import { getGroups } from "@/redux/actions/groupActions";
import { IoIosSearch } from "react-icons/io";
import GroupCard from "../GroupCard";

const SideBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const requests = useSelector((state) => state.friendRequests.requests);
  const friends = useSelector((state) => state.friends.friends);
  const [search, setSearch] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isPending, startTransition] = useTransition();
  const groups = useSelector((state) => state.getGroups.groups);

  useEffect(() => {
    dispatch(getGroups(user?.username));
  }, [dispatch, user?.username]);

  const searchFriend = useCallback(() => {
    try {
      startTransition(() => {
        const filteredFriends = friends.filter(
          (friend) =>
            friend.requestStatus.isAccepted &&
            friend.friendData.username
              .toLowerCase()
              .includes(search.toLocaleLowerCase())
        );
        setFilteredFriends(filteredFriends);

        const filteredGroups = groups.filter((group) =>
          group.groupName.toLowerCase().includes(search.toLocaleLowerCase())
        );
        setFilteredGroups(filteredGroups);
      });
    } catch (error) {
      console.error(error.message);
    }
  }, [search, friends, groups]);

  useEffect(() => {
    searchFriend();
  }, [searchFriend]);

  return (
    <>
      {user ? (
        <div className="sticky top-0 left-0 w-full h-screen overflow-y-clip bg-[#242423] flex flex-col justify-start items-start py-4 gap-5">
          <div className="flex flex-col justify-center items-center gap-6 w-full border-b border-b-[#2a2a2a]">
            <Link to="/" className="text-3xl font-bold">
              LOGO
            </Link>

            <div className="flex justify-between items-center w-full pb-1 gap-2">
              <div className="relative flex justify-center items-center">
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

                <div className="search__input">
                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent p-2 border border-[#404040] rounded-md"
                  />
                </div>

                <div className="search">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="bg-[#424242] p-1 w-10 h-10 flex justify-center items-center rounded-full transform transition-all ease-in-out duration-200 hover:opacity-80 active:scale-95">
                        <IoIosSearch size={22} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="w-full">
                        <input
                          type="text"
                          placeholder="Search"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="bg-[#424242] text-white p-2 rounded-lg w-full"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex justify-center items-center gap-3 pr-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="relative bg-[#424242] p-1 w-10 h-10 flex justify-center items-center rounded-full transform transition-all ease-in-out duration-200 hover:opacity-80 active:scale-95">
                      <AiOutlineUserAdd title="Add friend" size={28} />

                      <div
                        title={`${requests.length} requests`}
                        className="absolute -top-4 left-0 bg-red-600 text-white w-5 h-5 flex justify-center items-center rounded-full"
                      >
                        <p>{requests.length}</p>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full">
                    <AddFriend />
                  </PopoverContent>
                </Popover>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      title="Create group"
                      className="bg-[#424242] p-1 w-10 h-10 flex justify-center items-center rounded-full transform transition-all ease-in-out duration-200 hover:opacity-80 active:scale-95"
                    >
                      <FaRegPenToSquare size={24} />
                    </Button>
                  </DialogTrigger>
                  <CreateGroupDialog />
                </Dialog>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start gap-4 w-full p-1 hover:overflow-y-auto">
            {isPending ? (
              <>Loading...</>
            ) : (
              <div className="flex flex-col justify-start items-start gap-4 w-full">
                <h3 className="text-xl font-bold pb-2">Friends</h3>
                {filteredFriends.length == 0 ? (
                  <strong>You don't have any friends yet!</strong>
                ) : (
                  <>
                    {filteredFriends.map((friend) => (
                      <>
                        <div
                          key={friend.id}
                          className="w-full border-b border-b-[#404040] pb-1"
                        >
                          {friend.requestStatus.isPending ? null : (
                            <FriendCard friend={friend.friendData} />
                          )}
                        </div>
                      </>
                    ))}
                  </>
                )}

                <h3 className="text-xl font-bold py-2">Groups</h3>
                {filteredGroups.length == 0 ? (
                  <strong>You don't have any groups yet!</strong>
                ) : (
                  <>
                    {filteredGroups.map((group) => (
                      <GroupCard key={group.id} group={group} />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SideBar;
