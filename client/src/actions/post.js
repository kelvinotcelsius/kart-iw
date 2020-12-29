import api from '../utils/api';
import apiFile from '../utils/apiFile';
import { setAlert } from './alert';
import { GET_POSTS, POST_ERROR, ADD_POST } from './types';
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
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
