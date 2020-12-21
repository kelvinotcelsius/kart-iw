import axios from 'axios';

// When we have a token, we'll send it with every request we make instead of picking certain requests to send it to
// the token argument is passed in from localStorage
const setAuthToken = (token) => {
  if (token) {
    // set a global header x-auth-token
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // if what we pass into setAuthToken is not a token, then delete it from global headers
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
