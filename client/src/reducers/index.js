import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import post from './post';
import product from './product';
import user from './user';

export default combineReducers({ alert, auth, post, product, user });
