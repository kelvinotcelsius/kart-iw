const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  first: {
    type: String,
    trim: true,
  },
  last: {
    type: String,
    trim: true,
  },
  profile_pic: {
    type: String,
  },
  bio: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  phone: {
    type: String,
  },
  follower_count: {
    type: Number,
    required: true,
    default: 0,
  },
  likes_count: {
    type: Number,
    required: true,
    default: 0,
  },
  amount_earned: {
    type: Number,
    required: true,
    default: 0.0,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  followers: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'order' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'post' }],
  bookmarks: [{ type: Schema.Types.ObjectId, ref: 'post' }],
});

module.exports = User = mongoose.model('user', UserSchema);
