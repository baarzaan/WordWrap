import React, { useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaRegPenToSquare } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserDetails from "../UserDetails";

const SideBar = () => {
  const user = useSelector((state) => state.user.user);
  const [showUserDetails, setShowUserDetails] = useState(false);

  return (
    <>
      {user ? (
        <div className="sticky top-0 left-0 w-full h-screen bg-[#242423] flex flex-col justify-start items-start px-2 py-4 gap-5">
          <div className="flex flex-col justify-center items-center gap-3 w-full border-b border-b-[#2a2a2a] p-2">
            <Link to="/" className="text-3xl font-bold">
              LOGO
            </Link>

            <div className="flex justify-between items-center w-full">
              <div className="flex justify-center items-center gap-2">
                <img
                  src={user.photoURL}
                  className="w-10 h-10 object-cover rounded-full"
                  alt=""
                />

                <div className="relative flex justify-center items-center gap-1.5">
                  <strong
                    onClick={() => setShowUserDetails(!showUserDetails)}
                    className="cursor-pointer transform transition-all ease-in-out duration-200 hover:text-white/75 active:text-white/50"
                  >
                    {user.username}
                  </strong>

                  <button
                    title="More"
                    onClick={() => setShowUserDetails(!showUserDetails)}
                    className="cursor-pointer transform transition-all ease-in-out duration-200 hover:text-white/75 active:text-white/50"
                  >
                    {showUserDetails ? (
                      <IoIosArrowUp size={22} />
                    ) : (
                      <IoIosArrowDown size={22} />
                    )}
                  </button>

                  {showUserDetails && (
                    <UserDetails
                      showUserDetails={showUserDetails}
                      setShowUserDetails={setShowUserDetails}
                      user={user}
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-center items-center gap-3">
                <button
                  title="Add friend"
                  className="bg-[#424242] p-1 w-10 h-10 flex justify-center items-center rounded-full transform transition-all ease-in-out duration-200 hover:opacity-80 active:scale-95"
                >
                  <AiOutlineUserAdd size={28} />
                </button>

                <button
                  title="Create group"
                  className="bg-[#424242] p-1 w-10 h-10 flex justify-center items-center rounded-full transform transition-all ease-in-out duration-200 hover:opacity-80 active:scale-95"
                >
                  <FaRegPenToSquare size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SideBar;
