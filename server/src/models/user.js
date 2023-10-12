const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
    firstName: String,
    lastName: String,
    phoneNumber:Number,
    email: String,
    password: String,
    confirmPassword: String,
    role: {
      type: String,
      enum : ['Rider', 'User', 'Admin','Guest-User'],
      default: 'Guest-User'
  },
   avatarImage:String
  });
const User = mongoose.model('User', userSchema);

module.exports = User;