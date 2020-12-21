import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers'; // this is the index.js reducer that combines all our auth, profile, etc. reducers

const initialState = {}; // all of our initial states will be in the reducers

const middleware = [thunk];

// see https://github.com/zalmoxisus/redux-devtools-extension#usage for instructions
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
