import React from "react";

const UserDetails = ({ showUserDetails, setShowUserDetails, user }) => {
  return (
    <div className="absolute top-8 w-full p-2 bg-[#2a2a2a] rounded-lg flex flex-col justify-start items-start gap-3">
      <button>My info</button>
      <button>Logout</button>
    </div>
  );
};

export default UserDetails;
