import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/actions/authActions";
import { IoIosArrowBack } from "react-icons/io";

const UserDetails = ({ user }) => {
  const dispatch = useDispatch();
  const [showUserInfo, setShowUserInfo] = useState(false);

  return (
    <div className="w-full p-4 bg-[#424242] rounded-lg flex flex-col justify-start items-start gap-3">
      {!showUserInfo ? (
        <>
          <button
            onClick={() => setShowUserInfo(!showUserInfo)}
            className="bg-[#242423] w-full p-2 rounded-lg text-white transform transition-all ease-in-out duration-300 hover:bg-[#242423]/75 active:scale-95"
          >
            My info
          </button>

          <button
            onClick={() => {
              dispatch(logout());
              window.location.reload();
            }}
            className="bg-[#242423] w-full p-2 rounded-lg text-white transform transition-all ease-in-out duration-300 hover:bg-[#242423]/75 active:scale-95"
          >
            Logout
          </button>
        </>
      ) : (
        <div className="w-full flex flex-col justify-start items-start gap-6 text-white">
          <div className="flex justify-start items-start pb-2 gap-2 border-b border-b-[#525151] w-full">
            <button
              title="Back"
              onClick={() => setShowUserInfo(false)}
              className="transform transition-all ease-in-out duration-200 hover:bg-[#242423]/50 rounded-full p-1 active:scale-95"
            >
              <IoIosArrowBack size={22} />
            </button>
            <strong>My info</strong>
          </div>

          <div className="flex flex-col justify-start items-start gap-4 w-full">
            <strong>First name: {user?.firstName}</strong>
            <strong>Last name: {user?.lastName}</strong>
            <strong>Username: {user?.username}</strong>
            <strong>Email: {user?.email}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
