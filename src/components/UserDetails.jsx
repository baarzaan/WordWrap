import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/actions/authActions";
import { IoIosArrowBack } from "react-icons/io";
import { Button } from "./ui/button";

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
          <div className="flex justify-center items-center gap-2">
            <button
              title="Back"
              onClick={() => setShowUserInfo(false)}
              className="transform transition-all ease-in-out duration-200 hover:bg-[#242423]/50 rounded-full p-1 active:scale-95"
            >
              <IoIosArrowBack size={22} />
            </button>
            <strong>My info</strong>
          </div>

          <div className="flex flex-col justify-center items-center gap-4 w-full">
            <Input
              type="text"
              title="First Name"
              placeholder="First Name"
              defaultValue={user?.firstName}
            />

            <Input
              type="text"
              title="Last Name"
              placeholder="Last Name"
              defaultValue={user?.lastName}
            />

            <Input
              type="text"
              title="Username"
              placeholder="Username"
              defaultValue={user?.username}
            />

            <Input
              type="email"
              title="Email"
              defaultValue={user?.email}
              disabled
            />

            <Button className="w-full bg-[#242423]/50 transform transition-all ease-in-out duration-200 hover:bg-[#242423]/40 active:scale-95">
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
