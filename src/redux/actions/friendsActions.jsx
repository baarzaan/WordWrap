import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  ACCEPT_FRIEND_REQUEST_FAIL,
  ACCEPT_FRIEND_REQUEST_REQUEST,
  ACCEPT_FRIEND_REQUEST_SUCCESS,
  REJECT_FRIEND_REQUEST_FAIL,
  REJECT_FRIEND_REQUEST_REQUEST,
  REJECT_FRIEND_REQUEST_SUCCESS,
  REMOVE_FRIEND_FAIL,
  REMOVE_FRIEND_REQUEST,
  REMOVE_FRIEND_SUCCESS,
  TOGGLE_SEND_FRIEND_REQUEST_FAIL,
  TOGGLE_SEND_FRIEND_REQUEST_REQUEST,
  TOGGLE_SEND_FRIEND_REQUEST_SUCCESS,
} from "../constants/friendsConstants";
import { db } from "@/firebase/firebaseConfig";

export const toggleSendFriendRequest =
  (authenticatedUser, userToFriend) => async (dispatch) => {
    dispatch({ type: TOGGLE_SEND_FRIEND_REQUEST_REQUEST });

    try {
      // Authenticated user friends collection
      const authenticatedUserFriendsCollection = collection(
        db,
        `users/${authenticatedUser.email}/friends`
      );

      const authenticatedUserFriendsSnapshot = await getDocs(
        authenticatedUserFriendsCollection
      );
      const isFriend = authenticatedUserFriendsSnapshot.docs.find(
        (doc) => doc.data().friendData.email === userToFriend.email
      );

      // User to be friend requests collection
      const userToFriendRequestsCollection = collection(
        db,
        `users/${userToFriend.email}/requests`
      );
      const userToFriendRequestsSnapshot = await getDocs(
        userToFriendRequestsCollection
      );
      const isRequested = userToFriendRequestsSnapshot.docs.find(
        (doc) => doc.data().friendData.email === authenticatedUser.email
      );

      if (isFriend && isRequested) {
        await deleteDoc(doc(authenticatedUserFriendsCollection, isFriend.id));
        await deleteDoc(doc(userToFriendRequestsCollection, isRequested.id));

        dispatch({
          type: TOGGLE_SEND_FRIEND_REQUEST_SUCCESS,
          payload: "Friend request removed successfully!",
        });
      } else {
        await addDoc(authenticatedUserFriendsCollection, {
          requestStatus: {
            isPending: true,
            isAccepted: false,
          },
          friendData: userToFriend,
          createdAt: new Date(),
        });

        await addDoc(userToFriendRequestsCollection, {
          requestStatus: {
            isPending: true,
            isAccepted: false,
          },
          friendData: authenticatedUser,
          createdAt: new Date(),
        });

        dispatch({
          type: TOGGLE_SEND_FRIEND_REQUEST_SUCCESS,
          payload: "Friend request sent successfully!",
        });
      }
    } catch (error) {
      dispatch({
        type: TOGGLE_SEND_FRIEND_REQUEST_FAIL,
        payload: error.message,
      });
    }
  };

export const acceptFriendRequest =
  (authenticatedUser, userToFriend, requestId) => async (dispatch) => {
    dispatch({ type: ACCEPT_FRIEND_REQUEST_REQUEST });

    try {
      const authenticatedUserRequestsCollection = collection(
        db,
        `users/${authenticatedUser.email}/requests`
      );

      const authenticatedUserRequestsSnapshot = await getDocs(
        authenticatedUserRequestsCollection
      );
      const isRequested = authenticatedUserRequestsSnapshot.docs.find(
        (doc) => doc.data().friendData.email == userToFriend.friendData.email
      );

      if (isRequested) {
        await addDoc(
          collection(db, `users/${authenticatedUser.email}/friends`),
          {
            friendData: userToFriend.friendData,
            requestStatus: {
              isPending: false,
              isAccepted: true,
            },
            createdAt: new Date(),
          }
        );

        await deleteDoc(
          doc(db, `users/${authenticatedUser.email}/requests/${requestId}`)
        );
      }

      // Update the friend status for the user who sent the request
      const userToFriendFriendsCollection = collection(
        db,
        `users/${userToFriend.friendData.email}/friends`
      );
      const userToFriendFriendsSnapshot = await getDocs(
        userToFriendFriendsCollection
      );
      const isFriend = userToFriendFriendsSnapshot.docs.find(
        (doc) => doc.data().friendData.email == authenticatedUser.email
      );

      if (isFriend) {
        const friendDocRef = doc(
          db,
          `users/${userToFriend.friendData.email}/friends/${isFriend.id}`
        );
        await updateDoc(friendDocRef, {
          "requestStatus.isPending": false,
          "requestStatus.isAccepted": true,
          createdAt: new Date(),
        });
      }

      dispatch({
        type: ACCEPT_FRIEND_REQUEST_SUCCESS,
        payload: "Friend request accepted successfully!",
      });
    } catch (error) {
      dispatch({ type: ACCEPT_FRIEND_REQUEST_FAIL, payload: error.message });
    }
  };

export const rejectFriendRequest =
  (authenticatedUser, userToFriend, requestId) => async (dispatch) => {
    dispatch({ type: REJECT_FRIEND_REQUEST_REQUEST });

    try {
      const authenticatedUserRequestDoc = doc(
        db,
        `users/${authenticatedUser.email}/requests/${requestId}`
      );
      await deleteDoc(authenticatedUserRequestDoc, requestId);

      const userToFriendFriendsCollection = collection(
        db,
        `users/${userToFriend.friendData.email}/friends`
      );
      const userToFriendFriendsSnapshot = await getDocs(
        userToFriendFriendsCollection
      );
      const isFriend = userToFriendFriendsSnapshot.docs.find(
        (doc) => doc.data().friendData.email == authenticatedUser.email
      );

      if (isFriend) {
        await deleteDoc(doc(userToFriendFriendsCollection, isFriend.id));
      }

      dispatch({
        type: REJECT_FRIEND_REQUEST_SUCCESS,
        payload: "Friend request rejected successfully!",
      });
    } catch (error) {
      dispatch({ type: REJECT_FRIEND_REQUEST_FAIL, payload: error.message });
    }
  };

export const removeFriend =
  (authenticatedUser, friend, friendId) => async (dispatch) => {
    dispatch({ type: REMOVE_FRIEND_REQUEST });

    try {
      const authenticatedUserFriendsCollection = collection(
        db,
        `users/${authenticatedUser.email}/friends/${friendId}`
      );
      await deleteDoc(doc(authenticatedUserFriendsCollection, friendId));

      const friendFriendsCollection = collection(
        db,
        `users/${friend.friendData.email}/friends`
      );
      const friendFriendsSnapshot = await getDocs(friendFriendsCollection);
      const isFriend = friendFriendsSnapshot.docs.find(
        (doc) => doc.data.friendData.email == authenticatedUser.email
      );

      if (isFriend) {
        await deleteDoc(doc(friendFriendsCollection, isFriend.id));
      }

      dispatch({
        type: REMOVE_FRIEND_SUCCESS,
        // payload: friend.friendData.email,
      });
    } catch (error) {
      dispatch({ type: REMOVE_FRIEND_FAIL, payload: error.message });
    }
  };
