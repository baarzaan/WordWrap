import {
  ACCEPT_FRIEND_REQUEST_FAIL,
  ACCEPT_FRIEND_REQUEST_REQUEST,
  ACCEPT_FRIEND_REQUEST_SUCCESS,
  ADD_FRIEND_REQUEST_FAIL,
  ADD_FRIEND_REQUEST_REQUEST,
  ADD_FRIEND_REQUEST_SUCCESS,
  GET_FRIEND_REQUESTS_FAIL,
  GET_FRIEND_REQUESTS_REQUEST,
  GET_FRIEND_REQUESTS_SUCCESS,
  GET_FRIENDS_FAIL,
  GET_FRIENDS_REQUEST,
  GET_FRIENDS_SUCCESS,
} from "../constants/friendsConstants";

const initialState = {
  loading: false,
  friends: [],
  requests: [],
  success: "",
  error: null,
};

export const addFriendRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_FRIEND_REQUEST_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ADD_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      };

    case ADD_FRIEND_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const getFrinedsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FRIENDS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_FRIENDS_SUCCESS:
      return {
        ...state,
        loading: false,
        friends: action.payload,
      };

    case GET_FRIENDS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const getFrinedRequestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FRIEND_REQUESTS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_FRIEND_REQUESTS_SUCCESS:
      return {
        ...state,
        loading: false,
        requests: action.payload,
      };

    case GET_FRIEND_REQUESTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const acceptFriendRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACCEPT_FRIEND_REQUEST_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ACCEPT_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      };

    case ACCEPT_FRIEND_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
