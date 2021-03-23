import { SET_ALERT, REMOVE_ALERT } from './types';
import { v4 as uuidv4 } from 'uuid';

// actions are created with "action creators", which are arrow functions
// we want to dispatch multiple action types, so we do this with 'dispatch.' We're able to do this because of the thunk middleware
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uuidv4(); // creates a random id for the alert (so we can delete specific alerts)
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
