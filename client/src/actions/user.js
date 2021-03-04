import api from '../utils/api';
import { GET_USER, USER_ERROR } from './types';
import { setAlert } from './alert';

// Get user by user ID
export const getUser = (user_id) => async (dispatch) => {
  try {
    const res = await api.get(`/users/${user_id}`);
    console.log(res);
    dispatch({
      type: GET_USER,
      payload: res.data,
    });
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, 'danger'));
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.data.msg, status: err.response.status },
    });
  }
};
