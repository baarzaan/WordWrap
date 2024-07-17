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
  updateDoc,
  where,
} from "firebase/firestore";
import {
  CHANGE_GROUP_NAME_FAIL,
  CHANGE_GROUP_NAME_REQUEST,
  CHANGE_GROUP_NAME_SUCCESS,
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
        seenBy: [],
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
  (messageId, currentUserUsername) => async (dispatch) => {
    dispatch({ type: UPDATE_GROUP_MESSAGE_STATUS_REQUEST });

    try {
      if (messageId && currentUserUsername) {
        const messagesCollection = collection(
          db,
          `groups/${messageId}/messages`
        );
        const messagesSnapshot = await getDocs(messagesCollection);
        const updatePromises = messagesSnapshot.docs.map((doc) => {
          const message = doc.data();
          // console.log("Check message: ", message);

          if (
            message.receivers.includes(currentUserUsername) &&
            (!message.seenBy || !message.seenBy.includes(currentUserUsername))
          ) {
            // console.log("Seen message by: ", message);
            return updateDoc(doc.ref, {
              seenBy: arrayUnion(currentUserUsername),
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

export const changeGroupName = (group) => async (dispatch) => {
  dispatch({ type: CHANGE_GROUP_NAME_REQUEST });

  try {
    const groupDoc = doc(db, "groups", group.id);
    await updateDoc(groupDoc, {
      groupName: group.groupName,
    });

    dispatch({ type: CHANGE_GROUP_NAME_SUCCESS, payload: group });
  } catch (error) {
    dispatch({ type: CHANGE_GROUP_NAME_FAIL, payload: error.message });
  }
};
