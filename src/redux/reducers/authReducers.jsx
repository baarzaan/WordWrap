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

const initialState = {
  loading: false,
  user: null,
  resetPasswordText: "",
  error: null,
};

export const getUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_GET_USER_REQUEST:
      console.log('AUTH_GET_USER_REQUEST');
      return {
        ...state,
        loading: true,
      };

    case AUTH_GET_USER_SUCCESS:
      console.log('AUTH_GET_USER_SUCCESS', action.payload);
      return {
        ...state,
        loading: false,
        user: action.payload,
      };

    case AUTH_GET_USER_FAIL:
      console.log('AUTH_GET_USER_FAIL', action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };

    case AUTH_LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case AUTH_REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };

    case AUTH_REGISTER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const resetPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_RESET_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case AUTH_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        resetPasswordText: action.payload,
      };

    case AUTH_RESET_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export const logoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case AUTH_LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        user: null,
      };

    case AUTH_LOGOUT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};
