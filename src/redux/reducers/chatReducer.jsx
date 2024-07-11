import {
  SEND_CHAT_REQUEST,
  SEND_CHAT_SUCCESS,
  SEND_CHAT_FAIL,
  GET_CHATS_REQUEST,
  GET_CHATS_SUCCESS,
  GET_CHATS_FAIL,
} from "../constants/chatConstants";

const initialState = {
  loading: false,
  chats: [],
  error: null,
};

export const sendChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_CHAT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case SEND_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        chats: [...state.chats, action.payload],
      };

    case SEND_CHAT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return { ...state };
  }
};

export const getChatsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHATS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_CHATS_SUCCESS:
      return {
        ...state,
        loading: false,
        chats: action.payload,
      };

    case GET_CHATS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};
