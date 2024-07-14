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

const initialState = {
  loading: false,
  groups: [],
  messages: {},
  error: null,
};

export const createGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GROUP_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CREATE_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        groups: [...state.groups, action.payload],
      };

    case CREATE_GROUP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const getGroupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUPS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_GROUPS_SUCCESS:
      return {
        ...state,
        loading: false,
        groups: action.payload,
      };

    case GET_GROUPS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const sendMessageToGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_MESSAGE_TO_GROUP_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case SEND_MESSAGE_TO_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case SEND_MESSAGE_TO_GROUP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const getGroupMessagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUP_MESSAGES_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_GROUP_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: {
          ...state.messages,
          [action.payload.messageId]: action.payload.messages,
        },
      };

    case GET_GROUP_MESSAGES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};
