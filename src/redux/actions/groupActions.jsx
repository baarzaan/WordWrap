import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
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
  DELETE_GROUP_MESSAGE_FAIL,
  DELETE_GROUP_MESSAGE_REQUEST,
  DELETE_GROUP_MESSAGE_SUCCESS,
  GET_GROUP_MESSAGES_FAIL,
  GET_GROUP_MESSAGES_REQUEST,
  GET_GROUP_MESSAGES_SUCCESS,
  GET_GROUPS_FAIL,
  GET_GROUPS_REQUEST,
  GET_GROUPS_SUCCESS,
  SEND_MESSAGE_TO_GROUP_FAIL,
  SEND_MESSAGE_TO_GROUP_REQUEST,
  SEND_MESSAGE_TO_GROUP_SUCCESS,
  UPDATE_GROUP_MESSAGE_STATUS_FAIL,
  UPDATE_GROUP_MESSAGE_STATUS_REQUEST,
  UPDATE_GROUP_MESSAGE_STATUS_SUCCESS,
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
        whoRead: [],
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
        // console.log(messages);
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

export const updateGroupMessageStatus =
  (messageId, currentUser) => async (dispatch) => {
    dispatch({ type: UPDATE_GROUP_MESSAGE_STATUS_REQUEST });

    try {
      if (messageId && currentUser.username) {
        const messagesCollection = collection(
          db,
          `groups/${messageId}/messages`
        );
        const messagesSnapshot = await getDocs(messagesCollection);
        const updatePromises = messagesSnapshot.docs.map((doc) => {
          const message = doc.data();
          if (
            message.receivers == [currentUser.username] &&
            whoRead != [currentUser.username]
          ) {
            return updateDoc(doc.ref, {
              whoRead: arrayUnion(currentUser.username),
            });
          }
          return null;
        });

        await Promise.all(updatePromises);

        dispatch({
          type: UPDATE_GROUP_MESSAGE_STATUS_SUCCESS,
        });
      }
    } catch (error) {
      dispatch({
        type: UPDATE_GROUP_MESSAGE_STATUS_FAIL,
        payload: error.message,
      });
    }
  };

export const deleteGroupMessage = (groupId, messageId) => async (dispatch) => {
  dispatch({ type: DELETE_GROUP_MESSAGE_REQUEST });

  try {
    const messageDoc = doc(db, `groups/${groupId}/messages/${messageId}`);
    await deleteDoc(messageDoc, messageId);

    dispatch({
      type: DELETE_GROUP_MESSAGE_SUCCESS,
      payload: { groupId, messageId },
    });
  } catch (error) {
    dispatch({ type: DELETE_GROUP_MESSAGE_FAIL, payload: error.message });
  }
};
