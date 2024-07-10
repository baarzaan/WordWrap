import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import {
  GET_USERS_FAIL,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
} from "../constants/usersConstants";
import { db } from "@/firebase/firebaseConfig";

export const getUsers = () => (dispatch) => {
  dispatch({ type: GET_USERS_REQUEST });

  try {
    const usersCollection = collection(db, "users");
    onSnapshot(query(usersCollection, orderBy("createdAt")), (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: GET_USERS_SUCCESS, payload: users });
    });
  } catch (error) {
    dispatch({ type: GET_USERS_FAIL, payload: error.message });
  }
};
