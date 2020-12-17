const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token');

  // Check if not token, if true throw not authorized 401 error
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret')); //.verify() returns the decoded payloaded if the token is verified

    // set req.user to the user object that we defined in the payload when we originally created in the jwt in users.js, this allows us to reference req.user in any private route where we're logged in. req.user refers the user object in the jwt's payload. See users.js in 'routes/api' for how we create the token and the payload
    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
