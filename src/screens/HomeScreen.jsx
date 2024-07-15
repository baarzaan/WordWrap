import CreateGroupDialog from "@/components/CreateGroupDialog";
import SideBar from "@/components/layout/SideBar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import React from "react";

const HomeScreen = () => {
  return (
    <div className="main__layout grid grid-cols-5 gap-4 h-screen w-full">
      <div className="sidebar col-span-2">
        <SideBar />
      </div>

      <div className="main col-span-3">
        <div className="flex flex-col gap-4 justify-center items-center h-full">
          <h2 className="text-2xl font-bold">
            Send a message to start a chat.
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#424242] p-2 flex justify-center items-center rounded-lg transform transition-all ease-in-out duration-200 hover:opacity-80 active:scale-95">
                Send message
              </Button>
            </DialogTrigger>
            <CreateGroupDialog />
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
