import { createStore, applyMiddleware } from 'redux'; // thunk is our middleware
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers'; // this is the index.js reducer that combines all our auth, profile, etc. reducers
import setAuthToken from './utils/setAuthToken';

const initialState = {}; // all of our initial states will be in the reducers

const middleware = [thunk];

const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 }); // enables trace faeture in Redux Devtools

// see https://github.com/zalmoxisus/redux-devtools-extension#usage for instructions
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

// set up a store subscription listener
// to store the users token in localStorage

// initialize current state from redux store for subscription comparison
// preventing undefined error
let currentState = store.getState();

store.subscribe(() => {
  // keep track of the previous and current state to compare changes
  let previousState = currentState;
  currentState = store.getState();
  // if the token changes set the value in localStorage and axios headers
  if (previousState.auth.token !== currentState.auth.token) {
    const token = currentState.auth.token;
    setAuthToken(token);
  }
});

export default store;
