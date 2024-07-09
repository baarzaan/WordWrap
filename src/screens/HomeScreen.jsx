import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/authActions";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  return (
    <div>
      home
      <br />

      <br />

      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
};

export default HomeScreen;
