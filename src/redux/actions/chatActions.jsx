import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import {
  GET_CHATS_FAIL,
  GET_CHATS_REQUEST,
  GET_CHATS_SUCCESS,
  SEND_CHAT_FAIL,
  SEND_CHAT_REQUEST,
  SEND_CHAT_SUCCESS,
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
