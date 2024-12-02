
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     // required: true,
//   },
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: false, required: true },
  email: { type: String, unique: false, required: false },
  password: { type: String, required: false },
  googleId: { type: String, unique: true, required: false },
});

// Check if the model already exists to prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
