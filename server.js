const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chatRoutes");  // Updated chat routes
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

// Routes
app.use("/api/auth", authRoutes);  // Signup and Login routes
app.use("/api/chat", chatRoutes);  // Chat-related routes

// Check if OPENAI_API_KEY is set in the environment
console.log("GEMINI API Key:", process.env.GEMINI_API_KEY); // Debug log

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
