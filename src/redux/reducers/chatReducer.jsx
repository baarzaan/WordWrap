import {
  SEND_CHAT_REQUEST,
  SEND_CHAT_SUCCESS,
  SEND_CHAT_FAIL,
  GET_CHATS_REQUEST,
  GET_CHATS_SUCCESS,
  GET_CHATS_FAIL,
  UPDATE_CHATS_REQUEST,
  UPDATE_CHATS_SUCCESS,
  UPDATE_CHATS_FAIL,
  GET_CHAT_ID_REQUEST,
  GET_CHAT_ID_SUCCESS,
  GET_CHAT_ID_FAIL,
  CREATE_CHAT_REQUEST,
  CREATE_CHAT_SUCCESS,
  CREATE_CHAT_FAIL,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  GET_MESSAGES_REQUEST,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAIL,
  DELETE_MESSAGE_REQUEST,
  DELETE_MESSAGE_SUCCESS,
} from "../constants/chatConstants";

const initialState = {
  loading: false,
  chats: [],
  messages: {},
  chatId: null,
  error: null,
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

export const getChatIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHAT_ID_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_CHAT_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        chatId: action.payload,
      };

    case GET_CHAT_ID_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const createChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CHAT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CREATE_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        chatId: action.payload,
      };

    case CREATE_CHAT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const sendMessageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_MESSAGE_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case SEND_MESSAGE_SUCCESS:
      const { chatId, message } = action.payload;
      return {
        ...state,
        loading: false,
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), message],
        },
      };

    case SEND_MESSAGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const getMessagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: {
          ...state.messages,
          [action.payload.chatId]: action.payload.messages,
        },
      };

    case GET_MESSAGES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
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
        messages: {
          ...state.messages,
          [action.payload.chatId]: [
            ...(state.messages[action.payload.chatId] || []),
            action.payload.message,
          ],
        },
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

export const deleteMessageReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_MESSAGE_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case DELETE_MESSAGE_SUCCESS:
      const { chatId, messageId } = action.payload;
      return {
        ...state,
        loading: false,
        messages: {
          ...state.messages,
          [chatId]: state.messages[chatId].filter(
            (message) => message.id !== messageId
          ),
        },
      };

    case DELETE_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};
