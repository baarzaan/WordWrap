import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createGroup } from "@/redux/actions/groupActions";

const CreateGroupDialog = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [groupName, setGroupName] = useState("");
  const friends = useSelector((state) => state.friends.friends);
  const { loading, error } = useSelector((state) => state.createGroup);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "#212121",
      // match with the menu
      borderColor: "#969393",
      borderRadius: "6px",
      padding: "3px",
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        // Overwrittes the different states of border
        borderColor: "#969393",
        background: "#242423",
      },
    }),
    menu: (base) => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      background: "#212121",
      // kill the gap
      marginTop: 0,
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
    }),
  };

  const handleChangeFriends = (selectedFriends) => {
    setSelectedFriends(selectedFriends);
  };

  return (
    <DialogContent className="bg-[#242423] sm:max-w-[425px]">
      {error && <>{error}</>}
      <DialogHeader>
        <DialogTitle>Create group</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Input
          id="groupName"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="col-span-3"
        />

        <Select
          className=""
          styles={customStyles}
          placeholder="Select your friends"
          options={friends.map(
            (friend) =>
              friend.requestStatus.isAccepted && {
                value: friend.friendData.username,
                label: (
                  <div className="flex justify-start items-center gap-1">
                    <img
                      src={friend.friendData.photoURL}
                      className="w-8 h-8 rounded-full object-cover"
                      alt=""
                    />

                    <strong className="">{friend.friendData.username}</strong>
                  </div>
                ),
              }
          )}
          isMulti
          onChange={handleChangeFriends}
        />
      </div>
      <DialogFooter>
        <Button
          disabled={groupName.trim() == "" || selectedFriends.length == 0}
          onClick={() => {
            dispatch(
              createGroup(
                groupName,
                user?.username,
                selectedFriends.map((selectedFriend) => selectedFriend.value)
              )
            );
            alert("Group created successfully!");
          }}
          variant="secondary"
          type="submit"
        >
          {loading ? "Loading..." : "Create"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CreateGroupDialog;
