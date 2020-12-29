const express = require('express');
const connectDB = require('./config/db');
let multer = require('multer');
// const aws = require('aws-sdk');

// creates an Express application
const app = express();

// Necessary package to make POST request from React to Node backend
var cors = require('cors');
app.use(cors());

// Connect DB
connectDB();

// Middleware for parsing incoming requests containing JSON payloads
app.use(express.json({ extended: false }));

// Middleware for handling multi-part forms
let upload = multer();

// Define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/suppliers', require('./routes/api/suppliers'));
app.use('/api/products', require('./routes/api/products'));
app.use('/api/shop', require('./routes/api/shop'));
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

// // Configure AWS
// const S3_BUCKET = process.env.S3_BUCKET;
// aws.config.region = 'us-east-1' // N. Virginia
// aws.config.update({
//   accessKeyId: AKIAISVV7ZUVEHP7MPHA,
//   secretAccessKey: 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
// })

// app.get('/sign-s3', (req, res) => {
//   const s3 = new aws.S3();
//   const fileName = req.query['file-name'];
//   const fileType = req.query['file-type'];
//   const s3Params = {
//     Bucket: S3_BUCKET,
//     Key: fileName,
//     Expires: 60,
//     ContentType: fileType,
//     ACL: 'public-read'
//   };

//   s3.getSignedUrl('putObject', s3Params, (err, data) => {
//     if(err){
//       console.log(err);
//       return res.end();
//     }
//     const returnData = {
//       signedRequest: data,
//       url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
//     };
//     res.write(JSON.stringify(returnData));
//     res.end();
//   });
// });
