const express = require('express');
const connectDB = require('./config/db');

// creates an Express application
const app = express();

// Connect DB
connectDB();

// create a single endpoint to test
app.get('/', (req, res) => res.send('API Running'));

// Define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/products', require('./routes/api/products'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/shopping', require('./routes/api/shopping'));
app.use('/api/users', require('./routes/api/users'));

// process.env.PORT will look for a an enirontment variable called PORT to run it on which is how we'll run it on Heroku, but otherwise we'll just use 5000
const PORT = process.env.PORT || 5000;

// Starts a UNIX socket and listens for connections on the given path
app.listen(PORT, () => console.log(`Server started on part ${PORT}`));
