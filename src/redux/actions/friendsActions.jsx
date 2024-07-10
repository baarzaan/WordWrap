import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  ACCEPT_FRIEND_REQUEST_FAIL,
  ACCEPT_FRIEND_REQUEST_REQUEST,
  ACCEPT_FRIEND_REQUEST_SUCCESS,
  ADD_FRIEND_REQUEST_FAIL,
  ADD_FRIEND_REQUEST_REQUEST,
  ADD_FRIEND_REQUEST_SUCCESS,
} from "../constants/friendsConstants";
import { db } from "@/firebase/firebaseConfig";

// Add friend request action
export const addFriendRequest =
  (authenticatedUser, userToFriend) => async (dispatch) => {
    dispatch({ type: ADD_FRIEND_REQUEST_REQUEST });

    try {
      // Authenticated user friends collection
      const authenticatedUserFriendsCollection = collection(
        db,
        `users/${authenticatedUser.email}/friends`
      );
      await addDoc(authenticatedUserFriendsCollection, {
        requestStatus: {
          isPending: true,
          isAccepted: false,
        },
        friendData: userToFriend,
        createdAt: new Date(),
      });

      // User to be friend requests collection
      const userToFriendRequestsCollection = collection(
        db,
        `users/${userToFriend.email}/requests`
      );
      await addDoc(userToFriendRequestsCollection, {
        requestStatus: {
          isPending: true,
          isAccepted: false,
        },
        friendData: authenticatedUser,
        createdAt: new Date(),
      });

      dispatch({
        type: ADD_FRIEND_REQUEST_SUCCESS,
        payload: "Friend request sent successfully!",
      });
    } catch (error) {
      dispatch({ type: ADD_FRIEND_REQUEST_FAIL, payload: error.message });
    }
  };

// Accept friend request action
export const acceptFriendRequest =
  (authenticatedUser, userToFriend, requestId) => async (dispatch) => {
    dispatch({ type: ACCEPT_FRIEND_REQUEST_REQUEST });

    try {
      // Authenticated user friends collection
      const authenticatedUserFriendsCollection = collection(
        db,
        `users/${authenticatedUser.email}/friends`
      );
      await addDoc(authenticatedUserFriendsCollection, {
        friendData: userToFriend.friendData,
        createdAt: new Date(),
      });

      // User to be friend friends collection
      const userToFriendFriendsCollection = collection(
        db,
        `users/${userToFriend.friendData.email}/friends`
      );
      await addDoc(userToFriendFriendsCollection, {
        friendData: authenticatedUser,
        createdAt: new Date(),
      });

      // Remove the request from userToFriend's requests collection
      await deleteDoc(
        doc(db, `users/${userToFriend.friendData.email}/requests/${requestId}`)
      );

      console.log("Friend request accepted");

      dispatch({
        type: ACCEPT_FRIEND_REQUEST_SUCCESS,
        payload: "Friend request accepted successfully!",
      });
    } catch (error) {
      dispatch({ type: ACCEPT_FRIEND_REQUEST_FAIL, payload: error.message });
    }
  };
