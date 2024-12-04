const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const express = require("express");
const router = express.Router(); 


// // Google OAuth callback route
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/api/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if user exists
//         let user = await User.findOne({ googleId: profile.id });

//         if (user) return done(null, user);

//         // Ensure unique username
//         let username = profile.displayName || "Google_User";
//         let existingUser = await User.findOne({ username });
//         if (existingUser) {
//           username = `${username}_${profile.id.substring(0, 6)}`;
//         }

//         // Create a new user
//         user = new User({
//           googleId: profile.id,
//           username,
//           email: profile.emails?.[0]?.value || "no-email@google.com", // Handle missing emails
//         });
//         await user.save();
//         done(null, user);
//       } catch (err) {
//         console.error("Error in Google OAuth:", err);
//         done(err, null); // Pass error to Passport
//       }
//     }
//   )
// );


// Serialize and Deserialize Users

// passport.serializeUser((user, done) => {
//   done(null, user.id); // Serialize user by ID
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id); // Find user in database by ID
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// Route to initiate Google OAuth
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


// // Routes

// // Google OAuth Signup/Login route
// router.get("/google/login", passport.authenticate("google", { scope: ["profile", "email"] }));

// router.get("/google/signup", passport.authenticate("google", { scope: ["profile", "email"] }));


// // Google OAuth Callback route
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   async (req, res) => {
//     try {
//       // Check if the user is authenticated
//       if (!req.user) {
//         return res.redirect("/login");
//       }

//       // Generate JWT for authenticated user
//       const token = jwt.sign(
//         { userId: req.user._id },
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" }
//       );

//       // Check if it's a signup flow using the query parameter
//       if (req.query.signup) {
//         return res.redirect(`http://localhost:3000/chat?token=${token}`);
//       }

//       // Default behavior: redirect to the dashboard for login
//       res.redirect(`http://localhost:3000/chat?token=${token}`);
//     } catch (error) {
//       console.error("Error in callback:", error);
//       res.status(500).json({ msg: "Internal Server Error" });
//     }
//   }
// );


// Signup with username and password




const signup = async (req, res) => {
  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (username.length < 4) {
    return res.status(400).json({ message: "Username must be at least 4 characters." });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  // Check if email is valid
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  try {
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
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Login with username and password
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { signup, login, router };
