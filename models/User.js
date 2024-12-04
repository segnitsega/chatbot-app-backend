

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, minlength: 4},
  email: { type: String, unique: true, required: true,  match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"], },
  password: { type: String, required: false },
  googleId: { type: String, unique: true, required: false },
});


module.exports = mongoose.model('User', UserSchema);
