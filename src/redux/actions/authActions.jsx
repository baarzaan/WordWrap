import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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
import {
  GET_FRIEND_REQUESTS_FAIL,
  GET_FRIEND_REQUESTS_REQUEST,
  GET_FRIEND_REQUESTS_SUCCESS,
  GET_FRIENDS_FAIL,
  GET_FRIENDS_REQUEST,
  GET_FRIENDS_SUCCESS,
} from "../constants/friendsConstants";

export const getUser = () => (dispatch) => {
  dispatch({ type: AUTH_GET_USER_REQUEST });

  try {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const userDoc = doc(db, "users", currentUser.email);

        // Listen for user data changes
        onSnapshot(
          userDoc,
          (snapshot) => {
            const userData = snapshot.data();
            dispatch({ type: AUTH_GET_USER_SUCCESS, payload: userData });
          },
          (error) => {
            dispatch({ type: AUTH_GET_USER_FAIL, payload: error.message });
          }
        );

        // Listen for user friends
        const userFriendsCollection = collection(
          db,
          `users/${currentUser.email}/friends`
        );
        onSnapshot(
          query(userFriendsCollection, orderBy("createdAt", "desc")),
          (snapshot) => {
            const userFriends = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            dispatch({ type: GET_FRIENDS_SUCCESS, payload: userFriends });
          },
          (error) => {
            dispatch({ type: GET_FRIENDS_FAIL, payload: error.message });
          }
        );

        // Listen for friend requests
        const userFriendRequestsCollection = collection(
          db,
          `users/${currentUser.email}/requests`
        );
        onSnapshot(
          query(userFriendRequestsCollection, orderBy("createdAt", "desc")),
          (snapshot) => {
            const userFriendRequests = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            dispatch({
              type: GET_FRIEND_REQUESTS_SUCCESS,
              payload: userFriendRequests,
            });
          },
          (error) => {
            dispatch({
              type: GET_FRIEND_REQUESTS_FAIL,
              payload: error.message,
            });
          }
        );
      } else {
        // Handle case where no user is authenticated
        dispatch({
          type: AUTH_GET_USER_FAIL,
          payload: "No user authenticated",
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
    } else if (
      error.message == "Failed to get document because the client is offline."
    ) {
      dispatch({
        type: AUTH_LOGIN_FAIL,
        payload: "Failed to login because you are offline.",
      });
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

    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    const isUsernameExists = usersSnapshot.docs.find(
      (doc) => doc.data().username == userData.username
    );

    if (!userSnapshot.exists() && !isUsernameExists) {
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
    if (
      error.message == "Firebase: Error (auth/network-request-failed)." ||
      error.message == "Failed to get document because the client is offline."
    ) {
      dispatch({
        type: AUTH_REGISTER_FAIL,
        payload: "Failed to register because you are offline.",
      });
    } else {
      dispatch({ type: AUTH_REGISTER_FAIL, payload: error.message });
    }
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
    dispatch({ type: AUTH_LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({ type: AUTH_LOGOUT_FAIL, payload: error.message });
  }
};
