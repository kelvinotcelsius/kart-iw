const mongoose = require('mongoose');
const config = require('config');

// gets mongoURI value from default.json file in the config folder
const db = config.get('mongoURI');

// need a function to call
const connectDB = async () => {
  try {
    // this connects us to the database
    await mongoose.connect(db, {
      // these all address deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
