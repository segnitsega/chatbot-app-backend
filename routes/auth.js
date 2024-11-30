
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


router.post("/signup", async (req, res) => {
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
});

module.exports = router;
