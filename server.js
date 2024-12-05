require("dotenv").config();

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chatRoutes");
const chatController = require('./controllers/chatController');
const session = require("express-session");
const passport = require("passport");

const { router: authController } = require("./controllers/authController"); // Correctly import the router


const cors = require("cors");


// Load environment variables from .env file
dotenv.config();

// Initialize app
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Configure express-session
app.use(
  session({
    secret: "your_secret_key", // Replace with a strong, secure key
    resave: false, // Prevents resaving unchanged sessions
    saveUninitialized: false, // Prevents saving uninitialized sessions
    cookie: { secure: false }, // Set to `true` if using HTTPS
  })
);



// Routes
app.use("/api/auth", authController); 
app.use("/api/auth", authRoutes);  
app.use("/api/chat", chatRoutes);  

// Define the new route for the chat endpoint
app.post('/api/chat', chatController.chatWithAI);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





