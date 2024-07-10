import { GET_USERS_FAIL, GET_USERS_REQUEST, GET_USERS_SUCCESS } from "../constants/usersConstants";

const initialState = {
  loading: false,
  users: [],
  error: null,
};

export const getUsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };

    case GET_USERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};
