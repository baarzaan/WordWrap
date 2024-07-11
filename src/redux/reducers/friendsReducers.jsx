import {
  ACCEPT_FRIEND_REQUEST_FAIL,
  ACCEPT_FRIEND_REQUEST_REQUEST,
  ACCEPT_FRIEND_REQUEST_SUCCESS,
  GET_FRIEND_REQUESTS_FAIL,
  GET_FRIEND_REQUESTS_REQUEST,
  GET_FRIEND_REQUESTS_SUCCESS,
  GET_FRIENDS_FAIL,
  GET_FRIENDS_REQUEST,
  GET_FRIENDS_SUCCESS,
  REJECT_FRIEND_REQUEST_FAIL,
  REJECT_FRIEND_REQUEST_REQUEST,
  REJECT_FRIEND_REQUEST_SUCCESS,
  REMOVE_FRIEND_FAIL,
  REMOVE_FRIEND_REQUEST,
  REMOVE_FRIEND_SUCCESS,
  TOGGLE_SEND_FRIEND_REQUEST_FAIL,
  TOGGLE_SEND_FRIEND_REQUEST_REQUEST,
  TOGGLE_SEND_FRIEND_REQUEST_SUCCESS,
} from "../constants/friendsConstants";

const initialState = {
  loading: false,
  friends: [],
  requests: [],
  success: "",
  error: null,
};

export const toggleSendFriendRequestReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case TOGGLE_SEND_FRIEND_REQUEST_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case TOGGLE_SEND_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      };

    case TOGGLE_SEND_FRIEND_REQUEST_FAIL:
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

export const rejectFriendRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case REJECT_FRIEND_REQUEST_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case REJECT_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      };

    case REJECT_FRIEND_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const removeFriendReducers = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_FRIEND_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case REMOVE_FRIEND_SUCCESS:
      return {
        ...state,
        loading: false,
        friends: state.friends.filter((friend) => friend.friendData.email != action.payload),
      };

    case REMOVE_FRIEND_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};
