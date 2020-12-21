import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  // ACCOUNT_DELETED,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'), // we store the JWT in local storage, which we can access via JS
  isAuthenticated: null,
  loading: true, // once we get the data back from the backend and update the frontend, this will be set to false
  user: null,
};

export default function auth(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token); // if register is a success, the backend will send the token back and since we want the user to be logged in immediately, we'll put the token in local storage
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };

    case AUTH_ERROR:
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOGOUT:
      // case ACCOUNT_DELETED:
      localStorage.removeItem('token');
      return {
        ...state,
        user: null, // Kelvin added this line because it doesn't make sense for the user to be still stored in the state if the above actions are called. (Not in tutorial, Delete if it causes bugs)
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
