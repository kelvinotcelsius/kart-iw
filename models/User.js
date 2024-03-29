const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
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
    default: 'https://kart-iw.s3.amazonaws.com/default_prof_pic.png',
  },
  bio: {
    type: String,
    default: '',
  },
  birthday: {
    type: Date,
  },
  phone: {
    type: String,
    default: '',
  },
  amount_earned: {
    type: Number,
    required: true,
    default: 0.0,
  },
  payout: {
    type: Number,
    required: true,
    default: 0.0,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  stripe_id: {
    type: String,
  },
  address: {
    city: String,
    country: String,
    line1: String,
    line2: String,
    postal_code: String,
    state: String,
  },
  finishedRegistration: {
    type: Boolean,
    required: true,
    default: false,
  },
  followers: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  purchased_items: [{ type: Schema.Types.ObjectId, ref: 'product' }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'order' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'post' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'post' }],
  transfers: [{ type: Schema.Types.String }],
});

module.exports = User = mongoose.model('user', UserSchema);
