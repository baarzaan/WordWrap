import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  CREATE_CHAT_FAIL,
  CREATE_CHAT_REQUEST,
  CREATE_CHAT_SUCCESS,
  DELETE_MESSAGE_FAIL,
  DELETE_MESSAGE_REQUEST,
  DELETE_MESSAGE_SUCCESS,
  GET_CHAT_ID_FAIL,
  GET_CHAT_ID_REQUEST,
  GET_CHAT_ID_SUCCESS,
  GET_CHATS_FAIL,
  GET_CHATS_REQUEST,
  GET_CHATS_SUCCESS,
  GET_MESSAGES_FAIL,
  GET_MESSAGES_REQUEST,
  GET_MESSAGES_SUCCESS,
  SEND_MESSAGE_FAIL,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  UPDATE_MESSAGE_STATUS_FAIL,
  UPDATE_MESSAGE_STATUS_REQUEST,
  UPDATE_MESSAGE_STATUS_SUCCESS,
} from "../constants/chatConstants";
import { db } from "@/firebase/firebaseConfig";

export const getChats = () => async (dispatch) => {
  dispatch({ type: GET_CHATS_REQUEST });

  try {
    const chatsCollection = collection(db, "chats");
    onSnapshot(query(chatsCollection, orderBy("createdAt")), (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: GET_CHATS_SUCCESS, payload: chats });
    });
  } catch (error) {
    dispatch({ type: GET_CHATS_FAIL, payload: error.message });
  }
};

export const getChatId = (currentUser, userToSendChat) => async (dispatch) => {
  dispatch({ type: GET_CHAT_ID_REQUEST });

  try {
    const chatsCollection = collection(db, "chats");
    const q = query(
      chatsCollection,
      where("participants", "array-contains", currentUser)
    );
    const chatsSnapshot = await getDocs(q);

    let chatId = null;
    chatsSnapshot.forEach((doc) => {
      const participants = doc.data().participants;
      if (participants.includes(userToSendChat)) {
        chatId = doc.id;
      }
    });

    dispatch({ type: GET_CHAT_ID_SUCCESS, payload: chatId });
    return chatId;
  } catch (error) {
    dispatch({ type: GET_CHAT_ID_FAIL, payload: error.message });
  }
};

export const createChat = (currentUser, userToSendChat) => async (dispatch) => {
  dispatch({ type: CREATE_CHAT_REQUEST });

  try {
    const chatData = {
      participants: [currentUser, userToSendChat],
      createdAt: new Date(),
    };

    const chatCollection = collection(db, "chats");
    const chatDocRef = await addDoc(chatCollection, chatData);

    dispatch({ type: CREATE_CHAT_SUCCESS, payload: chatDocRef.id });
    return chatDocRef.id;
  } catch (error) {
    dispatch({ type: CREATE_CHAT_FAIL, payload: error.message });
  }
};

export const sendMessage =
  (chatId, currentUser, userToSendChat, message) => async (dispatch) => {
    dispatch({ type: SEND_MESSAGE_REQUEST });

    try {
      const messageData = {
        sender: currentUser,
        receiver: userToSendChat,
        message,
        createdAt: new Date(),
        isRead: false,
      };

      const messageCollection = collection(db, `chats/${chatId}/messages`);
      await addDoc(messageCollection, messageData);
      dispatch({
        type: SEND_MESSAGE_SUCCESS,
        payload: { chatId, messageData },
      });
    } catch (error) {
      dispatch({ type: SEND_MESSAGE_FAIL, payload: error.message });
    }
  };

export const getMessages = (chatId) => async (dispatch) => {
  dispatch({ type: GET_MESSAGES_REQUEST });

  try {
    const messagesCollection = collection(db, `chats/${chatId}/messages`);
    onSnapshot(
      query(messagesCollection, orderBy("createdAt", "desc")),
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({ type: GET_MESSAGES_SUCCESS, payload: { chatId, messages } });
      }
    );
  } catch (error) {
    dispatch({ type: GET_MESSAGES_FAIL, payload: error.message });
  }
};

export const deleteMessage = (chatId, messageId) => async (dispatch) => {
  dispatch({ type: DELETE_MESSAGE_REQUEST });

  try {
    const messageDoc = doc(db, `chats/${chatId}/messages/${messageId}`);
    await deleteDoc(messageDoc, messageId);
    dispatch({ type: DELETE_MESSAGE_SUCCESS, payload: { chatId, messageId } });
  } catch (error) {
    dispatch({ type: DELETE_MESSAGE_FAIL, payload: error.message });
  }
};

export const updateMessageStatus =
  (chatId, currentUserUsername) => async (dispatch) => {
    dispatch({ type: UPDATE_MESSAGE_STATUS_REQUEST });

    try {
      if (chatId && currentUserUsername) {
        const messagesCollection = collection(db, `chats/${chatId}/messages`);
        const messagesSnapshot = await getDocs(messagesCollection);
        const updatePromises = messagesSnapshot.docs.map((doc) => {
          const message = doc.data();
          // console.log("Checking message:", message);
          if (message.receiver == currentUserUsername && !message.isRead) {
            // console.log("Updating message:", message);
            return updateDoc(doc.ref, { isRead: true });
          }
          return null;
        });

        await Promise.all(updatePromises);

        dispatch({
          type: UPDATE_MESSAGE_STATUS_SUCCESS,
        });
      }
    } catch (error) {
      dispatch({ type: UPDATE_MESSAGE_STATUS_FAIL, payload: error.message });
    }
  };
