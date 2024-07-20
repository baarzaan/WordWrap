import { DialogClose, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { IoIosClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { addMemberToGroup } from "@/redux/actions/groupActions";

const AddMemberToGroupDialog = ({ group }) => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friends.friends);
  const { loading, error } = useSelector(
    (state) => state.addMemberToGroupReducer
  );
  const [selectedFriends, setSelectedFriends] = useState([]);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "#212121",
      borderColor: "#969393",
      borderRadius: "6px",
      padding: "3px",
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        borderColor: "#969393",
        background: "#242423",
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      background: "#212121",
      marginTop: 0,
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
    }),
  };

  const handleChangeFriends = (selectedFriends) => {
    setSelectedFriends(selectedFriends);
  };

  const getFriendOptions = () => {
    return friends
      .filter(
        (friend) =>
          friend.requestStatus.isAccepted
      )
      .map((friend) => ({
        value: friend.friendData.username,
        label: (
          <div className="flex justify-start items-center gap-1">
            <img
              src={friend.friendData.photoURL}
              className="w-8 h-8 rounded-full object-cover"
              alt={friend.friendData.username}
            />
            <strong>{friend.friendData.username}</strong>
          </div>
        ),
      }));
  };

  return (
    <DialogContent
      className="bg-[#212121]/75 p-2"
      style={{
        zIndex: 999,
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        height: "100vh",
      }}
    >
      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 p-2 w-[90%] md:w-1/2 bg-black/50 flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <span></span>
          <DialogTitle>Add members</DialogTitle>
          <DialogClose>
            <IoIosClose size={25} title="Close" />
          </DialogClose>
        </div>

        <div>
          <Select
            styles={customStyles}
            placeholder="Select your friends"
            options={getFriendOptions()}
            isMulti
            onChange={handleChangeFriends}
          />
        </div>

        <DialogFooter>
          <Button
            disabled={selectedFriends.length === 0}
            onClick={() => {
              dispatch(
                addMemberToGroup(
                  group.id,
                  selectedFriends.map((selectedFriend) => selectedFriend.value)
                )
              );
              alert("Members added successfully!");
            }}
            variant="secondary"
            type="submit"
          >
            {loading ? "Loading..." : "Add"}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
};

export default AddMemberToGroupDialog;
