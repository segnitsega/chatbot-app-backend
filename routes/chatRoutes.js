const express = require("express");
const Chat = require("../models/Chat");
const authMiddleware = require("../middleware/auth");
const axios = require("axios"); // Import axios for making HTTP requests
const router = express.Router();

// The Gemini API Key, make sure it's stored securely (e.g., in .env file)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post("/send", authMiddleware, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ msg: "Message is required" });
  }

  try {
    // Call Gemini API to get a response
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: message, // The message sent by the user
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the response from Gemini
    const botResponse = response.data.contents[0].parts[0].text;

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
    console.error('Error details:', error.response ? error.response.data : error);
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
