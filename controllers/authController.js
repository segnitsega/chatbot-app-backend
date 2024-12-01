// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const signup = async (req, res) => {
//   const { username, password } = req.body;

//   let user = await User.findOne({ username });
//   if (user) {
//     return res.status(400).json({ msg: "User already exists" });
//   }

//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   user = new User({
//     username,
//     password: hashedPassword,
//   });

//   await user.save();
//   res.status(201).json({ msg: "User registered successfully" });
// };

// const login = async (req, res) => {
//   const { username, password } = req.body;

//   let user = await User.findOne({ username });
//   if (!user) {
//     return res.status(400).json({ msg: "Invalid credentials" });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(400).json({ msg: "Invalid credentials" });
//   }

//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "1h",
//   });

//   res.json({ token });
// };

// module.exports = { signup, login };
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signup = async (req, res) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });
  if (user) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({
    username,
    password: hashedPassword,
  });

  await user.save();
  res.status(201).json({ msg: "User registered successfully" });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
};

module.exports = { signup, login };
