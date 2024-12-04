const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  //check for missing fields
  if (!username ||!email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // Validate username length
  if (username.length < 4) {
    return res.status(400).json({ msg: "Username must be at least 4 characters long" });
  }

  // Validate password length
  if (password.length < 8) {
    return res.status(400).json({ msg: "Password must be at least 8 characters long" });
  }

  // Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }


  try {
    // Check if user already exists
    // let user = await User.findOne({ username });
    // if (user) {
    //   return res.status(400).json({ msg: "User already exists" });
    // }

    // Check if user already exists with the same username or email
    let existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ msg: "User with this username or email already exists" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});



// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, msg: "All fields are required" });
  }

  try {
    // Find the user by username
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, msg: "Invalid credentials" });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "Invalid credentials" });
    }

    // If the password matches, generate JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send back the token and a success message
    res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ success: false, msg: "Invalid credentials" });
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
