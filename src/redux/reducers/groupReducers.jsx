import {
  ADD_MEMBER_TO_GROUP_FAIL,
  ADD_MEMBER_TO_GROUP_REQUEST,
  ADD_MEMBER_TO_GROUP_SUCCESS,
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
  LEAVE_GROUP_FAIL,
  LEAVE_GROUP_REQUEST,
  LEAVE_GROUP_SUCCESS,
  REMOVE_MEMBER_FROM_GROUP_FAIL,
  REMOVE_MEMBER_FROM_GROUP_REQUEST,
  REMOVE_MEMBER_FROM_GROUP_SUCCESS,
  SEND_MESSAGE_TO_GROUP_FAIL,
  SEND_MESSAGE_TO_GROUP_REQUEST,
  SEND_MESSAGE_TO_GROUP_SUCCESS,
  UPDATE_GROUP_MESSAGE_STATUS_FAIL,
  UPDATE_GROUP_MESSAGE_STATUS_REQUEST,
  UPDATE_GROUP_MESSAGE_STATUS_SUCCESS,
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

export const updateGroupMessageStatusReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case UPDATE_GROUP_MESSAGE_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_GROUP_MESSAGE_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case UPDATE_GROUP_MESSAGE_STATUS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const deleteGroupMessageReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_GROUP_MESSAGE_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case DELETE_GROUP_MESSAGE_SUCCESS:
      const { groupId, messageId } = action.payload;
      return {
        ...state,
        loading: false,
        messages: {
          ...state.messages,
          [groupId]: state.messages[groupId].filter(
            (message) => message.id !== messageId
          ),
        },
      };

    case DELETE_GROUP_MESSAGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const changeGroupNameReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_GROUP_NAME_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CHANGE_GROUP_NAME_SUCCESS:
      return {
        ...state,
        loading: false,
        group: [...state.groups, action.payload],
      };

    case CHANGE_GROUP_NAME_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const removeMemberFromGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_MEMBER_FROM_GROUP_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case REMOVE_MEMBER_FROM_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case REMOVE_MEMBER_FROM_GROUP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const leaveGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case LEAVE_GROUP_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case LEAVE_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case LEAVE_GROUP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const addMemberToGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MEMBER_TO_GROUP_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ADD_MEMBER_TO_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case ADD_MEMBER_TO_GROUP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};
