import React from "react";
import SideBar from "./SideBar";

const MainLayout = ({ children }) => {
  return (
    <div className="grid grid-cols-5 gap-4 h-screen w-full">
      <div className="sidebar col-span-2">
        <SideBar />
      </div>

      <div className="main col-span-3">{children}</div>
    </div>
  );
};

export default MainLayout;
