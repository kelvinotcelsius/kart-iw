import { USER_ERROR, GET_USER, FOLLOW } from '../actions/types';

const initialState = {
  user: null,
  loading: true,
  error: {},
};

export default function post(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_USER:
    case FOLLOW:
      return {
        ...state,
        user: payload,
        loading: false,
      };
    case USER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
