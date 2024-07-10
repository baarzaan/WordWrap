import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/authActions";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-full border border-red-500">
      home
      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
};

export default HomeScreen;
