import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  CREATE_GROUP_FAIL,
  CREATE_GROUP_REQUEST,
  CREATE_GROUP_SUCCESS,
  GET_GROUPS_FAIL,
  GET_GROUPS_REQUEST,
  GET_GROUPS_SUCCESS,
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
