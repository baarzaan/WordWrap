import {
  CREATE_GROUP_FAIL,
  CREATE_GROUP_REQUEST,
  CREATE_GROUP_SUCCESS,
  GET_GROUPS_FAIL,
  GET_GROUPS_REQUEST,
  GET_GROUPS_SUCCESS,
} from "../constants/groupConstants";

const initialState = {
  loading: false,
  groups: [],
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
