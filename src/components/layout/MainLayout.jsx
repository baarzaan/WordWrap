import React from "react";
import SideBar from "./SideBar";

const MainLayout = ({ children }) => {
  return (
    <div className="grid grid-cols-3 gap-4 h-screen">
      <div className="col-span-1">
        <SideBar />
      </div>

      <div className="col-span-2 h-full">{children}</div>
    </div>
  );
};

export default MainLayout;
