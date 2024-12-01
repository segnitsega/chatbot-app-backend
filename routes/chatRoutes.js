const express = require("express");
const Chat = require("../models/Chat");
const authMiddleware = require("../middleware/auth");
const OpenAI = require("openai"); // Import OpenAI SDK
const router = express.Router();

// Load GROK API Key from environment variable
const GROK_API_KEY = process.env.GROK_API_KEY;

if (!GROK_API_KEY) {
  throw new Error("The GROK_API_KEY environment variable is missing or empty. Please add it to your .env file.");
}

// Initialize OpenAI client with GROK API Key
const openai = new OpenAI({
  apiKey: GROK_API_KEY,
  baseURL: "https://api.x.ai/v1", // Set Grok API's base URL
});

router.post("/send", authMiddleware, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ msg: "Message is required" });
  }

  try {
    // Call xAI (Grok) API to generate a response
    const response = await openai.chat.completions.create({
      model: "grok-beta", // Grok's model
      messages: [
        { role: "system", content: "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy." },
        { role: "user", content: message }, // User's input message
      ],
    });

    // Extract the bot's response
    const botResponse = response.choices[0].message.content;

    // Save the chat to the database
    const chat = new Chat({
      user: req.user.id,
      message,
      response: botResponse,
    });

    await chat.save();

    res.json({ response: botResponse }); // Send bot response back to client
  } catch (error) {
    console.error(error.message);
    console.error("Error details:", error.response ? error.response.data : error);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET: Fetch chat history for the authenticated user
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
