import api from '../utils/api';
import { GET_PRODUCT, PRODUCT_ERROR } from './types';

// Get product by product ID
export const getProduct = (product_id) => async (dispatch) => {
  try {
    const res = await api.get(`/products/${product_id}`);
    dispatch({
      type: GET_PRODUCT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get product by post ID
export const getProductFromPostId = (post_id) => async (dispatch) => {
  try {
    const res = await api.get(`/products/post/${post_id}`);

    dispatch({
      type: GET_PRODUCT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
