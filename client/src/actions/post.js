import api from '../utils/api';
import apiFile from '../utils/apiFile';
import { setAlert } from './alert';
import { GET_POSTS, POST_ERROR, ADD_POST, GET_POST } from './types';
import { loadUser } from './auth';

// Get all posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await api.get('/posts/all');
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get post by ID
// Get post
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add post
export const addPost = (formData, selectedItemID, history) => async (
  dispatch
) => {
  try {
    const res = await apiFile.post(`/posts/${selectedItemID}`, formData);

    dispatch({
      type: ADD_POST,
      payload: res.data,
    });

    dispatch(setAlert('Post Created', 'success'));

    dispatch(loadUser());

    history.push('/');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get post by product ID
// Get post
export const getPostsbyProductID = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/posts/products/${id}`);

    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
