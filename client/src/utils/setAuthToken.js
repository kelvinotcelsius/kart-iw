import api from './api';
import apiFile from './apiFile';

// When we have a token, we'll send it with every request we make instead of picking certain requests to send it to
// the token argument is passed in from localStorage
const setAuthToken = (token) => {
  if (token) {
    // set a global header x-auth-token
    api.defaults.headers.common['x-auth-token'] = token;
    apiFile.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    // if what we pass into setAuthToken is not a token, then delete it from global headers
    delete api.defaults.headers.common['x-auth-token'];
    delete apiFile.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

export default setAuthToken;
