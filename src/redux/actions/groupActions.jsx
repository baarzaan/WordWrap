import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  CREATE_GROUP_FAIL,
  CREATE_GROUP_REQUEST,
  CREATE_GROUP_SUCCESS,
  GET_GROUP_MESSAGES_FAIL,
  GET_GROUP_MESSAGES_REQUEST,
  GET_GROUP_MESSAGES_SUCCESS,
  GET_GROUPS_FAIL,
  GET_GROUPS_REQUEST,
  GET_GROUPS_SUCCESS,
  SEND_MESSAGE_TO_GROUP_FAIL,
  SEND_MESSAGE_TO_GROUP_REQUEST,
  SEND_MESSAGE_TO_GROUP_SUCCESS,
} from "../constants/groupConstants";
import { db } from "@/firebase/firebaseConfig";

export const createGroup = (groupName, creator, users) => async (dispatch) => {
  dispatch({ type: CREATE_GROUP_REQUEST });

  try {
    const groupData = {
      groupName,
      participants: [creator, ...users],
      createdAt: new Date(),
    };

    const groupsCollection = collection(db, "groups");
    await addDoc(groupsCollection, groupData);

    dispatch({ type: CREATE_GROUP_SUCCESS, payload: groupData });
  } catch (error) {
    dispatch({ type: CREATE_GROUP_FAIL, payload: error.message });
  }
};

export const getGroups = (user) => async (dispatch) => {
  dispatch({ type: GET_GROUPS_REQUEST });

  try {
    const groupsCollection = collection(db, "groups");
    onSnapshot(
      query(
        groupsCollection,
        where("participants", "array-contains", user),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        const groups = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({ type: GET_GROUPS_SUCCESS, payload: groups });
      }
    );
  } catch (error) {
    dispatch({ type: GET_GROUPS_FAIL, payload: error.message });
  }
};

export const sendMessageToGroup =
  (messageId, sender, receivers, message) => async (dispatch) => {
    dispatch({ type: SEND_MESSAGE_TO_GROUP_REQUEST });

    try {
      const messageData = {
        sender,
        receivers,
        message,
        createdAt: new Date(),
      };

      const messagesCollcetion = collection(db, `groups/${messageId}/messages`);
      await addDoc(messagesCollcetion, messageData);

      dispatch({ type: SEND_MESSAGE_TO_GROUP_SUCCESS, payload: messageData });
    } catch (error) {
      dispatch({ type: SEND_MESSAGE_TO_GROUP_FAIL, payload: error.message });
    }
  };

export const getGroupMessages = (messageId) => async (dispatch) => {
  dispatch({ type: GET_GROUP_MESSAGES_REQUEST });

  try {
    const messagesCollection = collection(db, `groups/${messageId}/messages`);
    onSnapshot(
      query(messagesCollection, orderBy("createdAt", "desc")),
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({
          type: GET_GROUP_MESSAGES_SUCCESS,
          payload: { messageId, messages },
        });
      }
    );
  } catch (error) {
    dispatch({ type: GET_GROUP_MESSAGES_FAIL, payload: error.message });
  }
};
