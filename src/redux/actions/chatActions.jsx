import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  GET_CHATS_FAIL,
  GET_CHATS_REQUEST,
  GET_CHATS_SUCCESS,
  SEND_CHAT_FAIL,
  SEND_CHAT_REQUEST,
  SEND_CHAT_SUCCESS,
  UPDATE_CHATS_FAIL,
  UPDATE_CHATS_REQUEST,
  UPDATE_CHATS_SUCCESS,
} from "../constants/chatConstants";
import { db } from "@/firebase/firebaseConfig";

export const sendChat =
  (currentUser, userToSendChat, chatData) => async (dispatch) => {
    dispatch({ type: SEND_CHAT_REQUEST });

    try {
      const currentUserChatsCollection = collection(
        db,
        `chats/${currentUser.email}/friends/${userToSendChat.id}/chats`
      );
      await addDoc(currentUserChatsCollection, chatData);

      const userToSendChatChatsCollection = collection(
        db,
        `chats/${userToSendChat.friendData.email}/friends/${currentUser.email}/chats`
      );
      await addDoc(userToSendChatChatsCollection, chatData);

      dispatch({ type: SEND_CHAT_SUCCESS, payload: chatData });
    } catch (error) {
      dispatch({ type: SEND_CHAT_FAIL, payload: error.message });
    }
  };

  /* chats/barzan-arkan/chats, chats/${currentUser.username}-${friend.username}/chats */

export const getChats = (currentUser, userToSendChat) => async (dispatch) => {
  dispatch({ type: GET_CHATS_REQUEST });

  try {
    const currentUserChatsCollection = collection(
      db,
      `chats/${currentUser.email}/friends/${userToSendChat.id}/chats`
    );
    onSnapshot(
      query(currentUserChatsCollection, orderBy("createdAt", "desc")),
      (snapshot) => {
        const chats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({ type: GET_CHATS_SUCCESS, payload: chats });
      }
    );

    const userToSendChatChatsCollection = collection(
      db,
      `chats/${userToSendChat.friendData.email}/friends/${currentUser.email}/chats`
    );
    onSnapshot(
      query(userToSendChatChatsCollection, orderBy("createdAt", "desc")),
      (snapshot) => {
        const chats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({ type: GET_CHATS_SUCCESS, payload: chats });
      }
    );
  } catch (error) {
    dispatch({ type: GET_CHATS_FAIL, payload: error.message });
  }
};

export const updateChatStatus =
  (user, friend, friendUsername) => async (dispatch) => {
    dispatch({ type: UPDATE_CHATS_REQUEST });
    try {
      if (friendUsername) {
        const currentUserChatsCollection = collection(
          db,
          `chats/${user?.email}/friends/${friend?.friendData.email}/chats`
        );
        const currentUserChatsSnapshot = await getDocs(
          currentUserChatsCollection
        );
        const updatePromises = currentUserChatsSnapshot.docs.map((doc) => {
          return updateDoc(doc.ref, { isRead: true });
        });

        await Promise.all(updatePromises);

        const friendChatsCollection = collection(
          db,
          `chats/${friend?.friendData.email}/friends/${user?.email}/chats`
        );
        const friendChatsSnapshot = await getDocs(friendChatsCollection);
        const updatePromises2 = friendChatsSnapshot.docs.map((doc) => {
          return updateDoc(doc.ref, { isRead: true });
        });

        await Promise.all(updatePromises2);

        dispatch({ type: UPDATE_CHATS_SUCCESS });
      }
    } catch (error) {
      dispatch({ type: UPDATE_CHATS_FAIL, payload: error.message });
    }
  };
