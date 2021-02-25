import api from '../utils/api';
import { GET_USER, USER_ERROR } from './types';

// Get product by product ID
export const getUser = (user_id) => async (dispatch) => {
  try {
    const res = await api.get(`/users/${user_id}`);
    dispatch({
      type: GET_USER,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
