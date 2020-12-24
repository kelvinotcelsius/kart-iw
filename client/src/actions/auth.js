import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  USER_ERROR,
  REGISTRATION_FINISHED,
  LOGOUT,
} from './types';
import { setAlert } from './alert';
import api from '../utils/api';
import apiFile from '../utils/apiFile';

// Load user
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get('/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register user
export const register = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/users', formData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data, // res.data in this case is the JWT token that is returned from a successful login
    });

    dispatch(loadUser()); // Load user immediately after registering
  } catch (err) {
    const errors = err.response.data.errors; // response.data contains an error array with all the errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Finish registration
export const finishRegistration = (formData, history) => async (dispatch) => {
  try {
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // };
    // const body = JSON.stringify(formData);
    // const res = await axios.post('/api/users/profile', body, config);

    // const body = JSON.stringify(formData);

    const res = await apiFile.put('/users/profile', formData);

    dispatch({
      type: REGISTRATION_FINISHED,
      payload: res.data,
    });

    dispatch(setAlert('Registration finished', 'success'));

    dispatch(loadUser());

    history.push('/');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Login user
export const login = ({ email, password }) => async (dispatch) => {
  const body = JSON.stringify({ email, password });

  try {
    const res = await api.post('/auth', body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data, // res.data in this case is the JWT token that is returned from a successful login
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors; // response.data contains an error array with all the errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout user
export const logout = (dispatch) => {
  dispatch({ type: LOGOUT });
};
