const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  let user = await User.findOne({ username });
  if (user) {
    return res.status(400).json({ msg: "User already exists" });
  }

 

  // Create a new user with the plain password (no hashing)
  user = new User({
    username,
    password,  // Store the plain password (no hashing)
  });

  // Save the user to the database
  await user.save();
  res.status(201).json({ msg: "User registered successfully" });
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  let user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  
  // Compare the entered password with the stored plain password
  if (password !== user.password) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  // If the password matches, generate JWT
  const payload = { user: { id: user.id } };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Send back the token
  res.json({ token });
});

module.exports = router;
