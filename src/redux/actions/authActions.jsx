import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import {
  AUTH_GET_USER_FAIL,
  AUTH_GET_USER_REQUEST,
  AUTH_GET_USER_SUCCESS,
  AUTH_LOGIN_FAIL,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_FAIL,
  AUTH_LOGOUT_REQUEST,
  AUTH_LOGOUT_SUCCESS,
  AUTH_REGISTER_FAIL,
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
  AUTH_RESET_PASSWORD_FAIL,
  AUTH_RESET_PASSWORD_REQUEST,
  AUTH_RESET_PASSWORD_SUCCESS,
} from "../constants/authConstants";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const getUser = () => (dispatch) => {
  dispatch({ type: AUTH_GET_USER_REQUEST });

  try {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const userDoc = doc(db, "users", currentUser.email);
        onSnapshot(userDoc, (snapshot) => {
          currentUser = snapshot.data();
          dispatch({ type: AUTH_GET_USER_SUCCESS, payload: currentUser });
        });
      }
    });
  } catch (error) {
    dispatch({ type: AUTH_GET_USER_FAIL, payload: error.message });
  }
};

export const login = (userData) => async (dispatch) => {
  dispatch({ type: AUTH_LOGIN_REQUEST });

  try {
    const userDoc = doc(db, "users", userData.email);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      await signInWithEmailAndPassword(auth, userData.email, userData.password);
      await updateDoc(userDoc, {
        lastLogin: new Date(),
      });
      console.log("LOGGED IN SUCCESSFULLY");
      dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: userSnapshot.data(),
      });
    } else {
      dispatch({ type: AUTH_LOGIN_FAIL, payload: "User not found" });
    }
  } catch (error) {
    if (error.message === "Firebase: Error (auth/invalid-credential).") {
      dispatch({ type: AUTH_LOGIN_FAIL, payload: "Password wrong" });
    } else {
      dispatch({ type: AUTH_LOGIN_FAIL, payload: error.message });
    }
  }
};

export const register = (userData) => async (dispatch) => {
  dispatch({ type: AUTH_REGISTER_REQUEST });

  try {
    const userDoc = doc(db, "users", userData.email);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      await setDoc(userDoc, userData);
      console.log("REGISTERED IN SUCCESSFULLY");
      dispatch({
        type: AUTH_REGISTER_SUCCESS,
        payload: userSnapshot.data(),
      });

      dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: userSnapshot.data(),
      });
    } else {
      dispatch({ type: AUTH_REGISTER_FAIL, payload: "User already exists" });
    }
  } catch (error) {
    dispatch({ type: AUTH_REGISTER_FAIL, payload: error.message });
  }
};

export const resetPassword = (email) => async (dispatch) => {
  dispatch({ type: AUTH_RESET_PASSWORD_REQUEST });

  try {
    const userDoc = doc(db, "users", email);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      await sendPasswordResetEmail(auth, email);

      dispatch({
        type: AUTH_RESET_PASSWORD_SUCCESS,
        payload: "Reset password link sent to your email successfully!",
      });
    } else {
      dispatch({ type: AUTH_RESET_PASSWORD_FAIL, payload: "User not found" });
    }
  } catch (error) {
    dispatch({ type: AUTH_RESET_PASSWORD_FAIL, payload: error.message });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({ type: AUTH_LOGOUT_REQUEST });

  try {
    await signOut(auth);
    dispatch({ type: AUTH_LOGOUT_SUCCESS, payload: null });
  } catch (error) {
    dispatch({ type: AUTH_LOGOUT_FAIL, payload: error.message });
  }
};
