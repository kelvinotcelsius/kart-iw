import api from '../utils/api';
import { GET_PRODUCT, PRODUCT_ERROR } from './types';

// Get product by post ID
export const getProductFromPostId = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/products/${id}`);

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
