

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const passport = require("passport");
// const express = require("express");
// const router = express.Router(); // Initialize router


// // Inside Google strategy callback function
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/api/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if user already exists in the database
//         let user = await User.findOne({ googleId: profile.id });
        
//         if (!user) {
//           // If not, create a new user
//           user = await User.findOne({ username: profile.displayName });
          
//           // If a user with the same username exists, create a unique one
//           if (user) {
//             const newUsername = `${profile.displayName}_${profile.id}`; // Add Google ID to make it unique
//             user = new User({
//               username: newUsername,
//               email: profile.emails[0].value,
//               googleId: profile.id,
//             });
//           } else {
//             user = new User({
//               username: profile.displayName,
//               email: profile.emails[0].value,
//               googleId: profile.id,
//             });
//           }

//           await user.save();
//         }

//         // Generate JWT token for the user
//         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//           expiresIn: "1h",
//         });
//         done(null, token);
//       } catch (error) {
//         done(error, null);
//       }
//     }
//   )
// );



// // Google OAuth Signup route
// router.get("/google/signup", passport.authenticate("google", { scope: ["profile", "email"] }));

// // Google OAuth Callback route
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     // If successful, send back the token to the frontend
//     res.redirect(`http://localhost:3000/login?token=${req.user}`);
//   }
// );

// // Google OAuth Login route
// router.get("/google/login", passport.authenticate("google", { scope: ["profile", "email"] }));

// // Google OAuth Callback route for login
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     // Send back the token after successful login
//     res.redirect(`http://localhost:3000/login?token=${req.user}`);
//   }
// );

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


// module.exports = { signup, login, router };


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const express = require("express");
const router = express.Router(); // Initialize router


// Google OAuth callback route
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists by Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User already exists, return it
          return done(null, user);
        }

        // If user does not exist, check for unique username
        let username = profile.displayName;
        let existingUser = await User.findOne({ username: username });

        // If username already exists, create a new unique one
        if (existingUser) {
          username = `${username}_${profile.id}`;  // Append the Google ID to make it unique
        }

        // Create a new user
        user = new User({
          googleId: profile.id,
          username: username,
          email: profile.emails[0].value,
        });

        await user.save();  // Save the new user to the database
        done(null, user);   // Proceed with the user object

      } catch (err) {
        console.error("Error in Google login:", err);
        done(err, null);
      }
    }
  )
);

// Serialize and Deserialize Users
passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user by ID
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Find user in database by ID
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Routes

// Google OAuth Signup/Login route
router.get("/google/login", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/signup", passport.authenticate("google", { scope: ["profile", "email"] }));


// Google OAuth Callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Generate JWT token for the authenticated user
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.redirect(`http://localhost:3000/login?token=${token}`); // Send token to the frontend
  }
);

// Signup with username and password
const signup = async (req, res) => {
  const { username, password } = req.body;

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
