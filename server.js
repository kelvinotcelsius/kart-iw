const express = require('express');
const connectDB = require('./config/db');

// creates an Express application
const app = express();

// Necessary package to make POST request from React to Node backend
var cors = require('cors');
app.use(cors());

// Connect DB
connectDB();

// Middleware for parsing incoming requests containing JSON payloads
app.use(express.json({ extended: false }));

// Define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/suppliers', require('./routes/api/suppliers'));
app.use('/api/products', require('./routes/api/products'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/shopping', require('./routes/api/shopping'));
app.use('/api/users', require('./routes/api/users'));

// Serve static assets in production (place this section under route defitions)
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  // Create a route that takes in any path (hence the *) except the 4 routes defined above and loasd the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')); // args mean from the current directory, go in the client folder, then go in the build folder, and load index.html
  });
}

// process.env.PORT will look for a an enirontment variable called PORT to run it on which is how we'll run it on Heroku, but otherwise we'll just use 5000
const PORT = process.env.PORT || 5000;

// Starts a UNIX socket and listens for connections on the given path
app.listen(PORT, () => console.log(`Server started on part ${PORT}`));
