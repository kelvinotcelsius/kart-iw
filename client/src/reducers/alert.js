import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function alert(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload]; // state is immutable so we have to include the spread operator, which spreads the state into its individal elements and adds payload as an element to the array
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload); // we want to remove an alert with a specfic ID, which is defined in the payload. The payload can be whatever we want
    default:
      return state; // every reducer we create will have a default of return state
  }
}
